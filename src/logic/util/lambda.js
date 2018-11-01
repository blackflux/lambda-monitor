const AWS = require('aws-sdk');

module.exports = (options) => {
  const resources = new AWS.ResourceGroupsTaggingAPI(options);
  const cloudwatchlogs = new AWS.CloudWatchLogs(options);

  const loggroupprefix = fn => `/aws/lambda/${fn.FunctionName}`;

  const falseNotFound = (err) => {
    if (err.code && err.code === 'ResourceNotFoundException') {
      return false;
    }
    throw (err);
  };

  const getAllFunctions = (reqOptions = {}) => resources
    .getResources({ ...reqOptions, ResourceTypeFilters: ['lambda'] }).promise()
    .then((data) => {
      const result = data.ResourceTagMappingList.map(r => ({
        FunctionARN: r.ResourceARN,
        FunctionName: r.ResourceARN.substring(r.ResourceARN.lastIndexOf(':') + 1, r.ResourceARN.length),
        Tags: r.Tags.reduce((p, e) => Object.assign(p, ({ [e.Key]: e.Value })), {})
      }));
      if (data.PaginationToken === '') {
        return result;
      }
      return getAllFunctions({ ...reqOptions, PaginationToken: data.PaginationToken })
        .then(resultList => resultList.concat(result));
    });

  const appendLogRetentionInfo = fns => Promise.all(
    fns.map(fn => cloudwatchlogs
      .describeLogGroups({
        logGroupNamePrefix: loggroupprefix(fn)
      }).promise()
      .then(r => ({
        logGroups: r.logGroups.filter(e => e.logGroupName === loggroupprefix(fn)),
        ...fn
      }))
      .catch(falseNotFound))
  ).then(res => res.filter(fn => fn !== false));

  const appendLogSubscriptionInfo = fns => Promise.all(
    fns.map(fn => cloudwatchlogs
      .describeSubscriptionFilters({
        logGroupName: loggroupprefix(fn)
      })
      .promise()
      .then(r => ({ ...r, ...fn }))
      .catch(falseNotFound))
  ).then(res => res.filter(fn => fn !== false));

  const setCloudWatchRetention = (fn, retentionInDays) => cloudwatchlogs
    .putRetentionPolicy({
      logGroupName: loggroupprefix(fn),
      retentionInDays
    }).promise();

  const subscribeCloudWatchLogGroup = (monitor, producer) => cloudwatchlogs
    .putSubscriptionFilter({
      destinationArn: monitor.FunctionARN,
      filterName: 'NoneFilter',
      filterPattern: '',
      logGroupName: loggroupprefix(producer)
    }).promise();

  return {
    getAllFunctions,
    appendLogRetentionInfo,
    appendLogSubscriptionInfo,
    setCloudWatchRetention,
    subscribeCloudWatchLogGroup
  };
};
