const AWS = require('aws-sdk');
var Promise = require('bluebird');
AWS.config.setPromisesDependency(Promise);

module.exports = options => {
  const resources = new AWS.ResourceGroupsTaggingAPI(options);
  const cloudwatchlogs = new AWS.CloudWatchLogs(options);

  const loggroupprefix = f => `/aws/lambda/${f.FunctionName}`;

  const getAllFunctions = (reqOptions = {}) =>
    resources
      .getResources({
        ...reqOptions,
        ResourceTypeFilters: ['lambda'],
      })
      .promise()
      .then(data => {
        const { PaginationToken, ResourceTagMappingList } = data;
        const result = ResourceTagMappingList.map(r => ({
          FunctionARN: r.ResourceARN,
          FunctionName: r.ResourceARN.substring(
            r.ResourceARN.lastIndexOf(':') + 1,
            r.ResourceARN.length,
          ),
          Tags: Object.assign(...r.Tags.map(e => ({ [e.Key]: e.Value }))),
        }));
        return PaginationToken === ''
          ? result
          : getAllFunctions({ ...reqOptions, PaginationToken }).then(
              resultList => resultList.concat(result),
            );
      });

  const appendLogRetentionInfo = functions =>
    Promise.all(functions)
      .filter(isLogGroup)
      .map(f =>
        cloudwatchlogs
          .describeLogGroups({
            logGroupNamePrefix: loggroupprefix(f),
          })
          .promise()
          .then(res => ({
            f,
            logGroups: res.logGroups.filter(
              e => e.logGroupName === loggroupprefix(f),
            ),
          })),
      );

  const appendLogSubscriptionInfo = functions =>
    Promise.all(functions)
      .filter(isLogGroup)
      .mapSeries(f =>
        cloudwatchlogs
          .describeSubscriptionFilters({
            logGroupName: loggroupprefix(f),
          })
          .promise()
          .then(res => ({ ...res, ...f })),
      );

  const setCloudWatchRetention = (f, retentionInDays) =>
    cloudwatchlogs
      .putRetentionPolicy({
        logGroupName: loggroupprefix(f),
        retentionInDays,
      })
      .promise();

  const subscribeCloudWatchLogGroup = (monitor, producer) =>
    cloudwatchlogs
      .putSubscriptionFilter({
        destinationArn: monitor.FunctionARN,
        filterName: 'NoneFilter',
        filterPattern: '',
        logGroupName: `/aws/lambda/${producer.FunctionName}`,
      })
      .promise();

  const isLogGroup = f =>
    cloudwatchlogs
      .describeLogStreams({
        logGroupName: loggroupprefix(f),
        limit: 1,
      })
      .promise()
      .then(data => {
        console.log('DEBUG: isLogGroup', loggroupprefix(f));
        return true;
      })
      .catch(err => {
        console.log('ERROR: isLogGroup', loggroupprefix(f));
        return false;
      });

  return {
    getAllFunctions,
    appendLogRetentionInfo,
    appendLogSubscriptionInfo,
    setCloudWatchRetention,
    subscribeCloudWatchLogGroup,
  };
};
