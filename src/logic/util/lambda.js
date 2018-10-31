const AWS = require('aws-sdk');

module.exports = (options) => {
  const resources = new AWS.ResourceGroupsTaggingAPI(options);
  const cloudwatchlogs = new AWS.CloudWatchLogs(options);

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

  const appendLogRetentionInfo = fns => Promise
    .all(fns.map(fn => cloudwatchlogs
      .describeLogGroups({
        logGroupNamePrefix: `/aws/lambda/${fn.FunctionName}`
      }).promise()
      .then(r => ({
        logGroups: r.logGroups.filter(e => e.logGroupName === `/aws/lambda/${fn.FunctionName}`),
        ...fn
      }))));

  const appendLogSubscriptionInfo = fns => Promise
    .all(fns.map(fn => cloudwatchlogs
      .describeSubscriptionFilters({
        logGroupName: `/aws/lambda/${fn.FunctionName}`
      }).promise()
      .then(r => ({ ...r, ...fn }))));

  const setCloudWatchRetention = (fn, retentionInDays) => cloudwatchlogs
    .putRetentionPolicy({
      logGroupName: `/aws/lambda/${fn.FunctionName}`,
      retentionInDays
    }).promise();

  const subscribeCloudWatchLogGroup = (monitor, producer) => cloudwatchlogs
    .putSubscriptionFilter({
      destinationArn: monitor.FunctionARN,
      filterName: 'NoneFilter',
      filterPattern: '',
      logGroupName: `/aws/lambda/${producer.FunctionName}`
    }).promise();

  return {
    getAllFunctions,
    appendLogRetentionInfo,
    appendLogSubscriptionInfo,
    setCloudWatchRetention,
    subscribeCloudWatchLogGroup
  };
};
