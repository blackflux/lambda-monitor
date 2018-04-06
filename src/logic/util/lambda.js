const AWS = require("aws-sdk");

module.exports = (options) => {
  const resources = new AWS.ResourceGroupsTaggingAPI(options);
  const cloudwatchlogs = new AWS.CloudWatchLogs(options);

  const getAllFunctions = (reqOptions = {}) => new Promise((resolve, reject) => resources
    .getResources(Object.assign({}, reqOptions, {
      ResourceTypeFilters: ['lambda']
    }), (err, data) => {
      if (err) {
        return reject(err);
      }
      const result = data.ResourceTagMappingList.map(r => ({
        FunctionARN: r.ResourceARN,
        FunctionName: r.ResourceARN.substring(r.ResourceARN.lastIndexOf(":") + 1, r.ResourceARN.length),
        Tags: Object.assign(...r.Tags.map(e => ({ [e.Key]: e.Value })))
      }));
      return data.PaginationToken === ''
        ? resolve(result)
        : getAllFunctions(Object.assign({}, reqOptions, { PaginationToken: data.PaginationToken }))
          .then(resultList => resolve(resultList.concat(result)))
          .catch(reject);
    }));

  const appendLogRetentionInfo = functions => Promise
    .all(functions.map(f => new Promise((resolve, reject) => cloudwatchlogs.describeLogGroups({
      logGroupNamePrefix: `/aws/lambda/${f.FunctionName}`
    }, (err, res) => (err ? reject(err) : resolve(Object.assign({
      logGroups: res.logGroups.filter(e => e.logGroupName === `/aws/lambda/${f.FunctionName}`)
    }, f)))))));

  const appendLogSubscriptionInfo = functions => Promise
    .all(functions.map(f => new Promise((resolve, reject) => cloudwatchlogs.describeSubscriptionFilters({
      logGroupName: `/aws/lambda/${f.FunctionName}`
    }, (err, res) => (err ? reject(err) : resolve(Object.assign(res, f)))))));

  const setCloudWatchRetention = (f, retentionInDays) => new Promise((resolve, reject) => cloudwatchlogs
    .putRetentionPolicy({
      logGroupName: `/aws/lambda/${f.FunctionName}`,
      retentionInDays
    }, (err, resp) => {
      if (err) {
        return reject(err);
      }
      return resolve(resp);
    }));

  const subscribeCloudWatchLogGroup = (monitor, producer) => new Promise((resolve, reject) => cloudwatchlogs
    .putSubscriptionFilter({
      destinationArn: monitor.FunctionARN,
      filterName: 'NoneFilter',
      filterPattern: "",
      logGroupName: `/aws/lambda/${producer.FunctionName}`
    }, (err, resp) => {
      if (err) {
        return reject(err);
      }
      return resolve(resp);
    }));

  return {
    getAllFunctions,
    appendLogRetentionInfo,
    appendLogSubscriptionInfo,
    setCloudWatchRetention,
    subscribeCloudWatchLogGroup
  };
};
