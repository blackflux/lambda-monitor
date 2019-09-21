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

  const appendLogGroupInfo = async (fns) => {
    const lambdaLogGroups = [];
    let nextToken;
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await aws.call('CloudWatchLogs:describeLogGroups', {
        ...(nextToken ? { nextToken } : {}),
        logGroupNamePrefix: '/aws/lambda/',
        limit: 50
      }, { expectedErrorCodes: ['ResourceNotFoundException'] });
      if (response !== 'ResourceNotFoundException') {
        lambdaLogGroups.push(...response.logGroups);
      }
      nextToken = response.nextToken;
    } while (nextToken);
    return fns.map((fn) => ({
      ...fn,
      logGroup: lambdaLogGroups.find((g) => g.logGroupName === logGroupName(fn))
    }));
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

  const setCloudWatchRetention = (fn, retentionInDays) => aws
    .call('CloudWatchLogs:putRetentionPolicy', {
      logGroupName: logGroupName(fn),
      retentionInDays
    });

  const subscribeCloudWatchLogGroup = (monitor, producer) => aws
    .call('CloudWatchLogs:putSubscriptionFilter', {
      destinationArn: monitor.FunctionARN,
      filterName: 'NoneFilter',
      filterPattern: '',
      logGroupName: logGroupName(producer)
    });

  return {
    getAllFunctions,
    appendLogGroupInfo,
    appendLogSubscriptionInfo,
    setCloudWatchRetention,
    subscribeCloudWatchLogGroup
  };
};
