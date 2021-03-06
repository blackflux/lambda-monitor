const get = require('lodash.get');
const Aws = require('aws-sdk-wrap');

module.exports = (options) => {
  const aws = Aws({ config: options });

  const logGroupName = (fn) => `/aws/lambda/${fn.FunctionName}`;

  const getAllFunctions = async (reqOptions = {}) => {
    const result = [];
    let PaginationToken;
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await aws.call('ResourceGroupsTaggingAPI:getResources', {
        ...reqOptions,
        ...(PaginationToken ? { PaginationToken } : {}),
        ResourceTypeFilters: ['lambda'],
        ResourcesPerPage: 100
      });
      result.push(...response.ResourceTagMappingList.map((r) => ({
        FunctionARN: r.ResourceARN,
        FunctionName: r.ResourceARN.substring(r.ResourceARN.lastIndexOf(':') + 1, r.ResourceARN.length),
        Tags: r.Tags.reduce((p, e) => Object.assign(p, ({ [e.Key]: e.Value })), {})
      })));
      PaginationToken = response.PaginationToken;
    } while (PaginationToken);
    return result;
  };

  const appendLogSubscriptionInfo = (fns) => Promise.all(
    fns.map((fn) => aws
      .call('CloudWatchLogs:describeSubscriptionFilters', { logGroupName: logGroupName(fn) })
      .then((r) => ({
        ...r,
        ...fn
      }))
      .catch((err) => {
        if (err.code === 'ResourceNotFoundException') {
          return false;
        }
        throw err;
      }))
  ).then((res) => res.filter((fn) => fn !== false));

  const subscribeCloudWatchLogGroup = (monitor, producer) => aws
    .call('CloudWatchLogs:putSubscriptionFilter', {
      destinationArn: monitor.FunctionARN,
      filterName: 'NoneFilter',
      filterPattern: '',
      logGroupName: logGroupName(producer)
    });

  const getFunctionConfiguration = async (name) => get(await aws
    .call('Lambda:getFunction', {
      FunctionName: name
    }), 'Configuration');

  return {
    getAllFunctions,
    appendLogSubscriptionInfo,
    subscribeCloudWatchLogGroup,
    getFunctionConfiguration
  };
};
