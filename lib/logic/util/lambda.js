const AWS = require("aws-sdk");

module.exports = (options) => {
  const lambda = new AWS.Lambda(options);
  const cloudwatchlogs = new AWS.CloudWatchLogs(options);

  const getAllFunctions = (marker = null) => new Promise((resolve, reject) => lambda
    .listFunctions({ Marker: marker }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return data.NextMarker === null ? resolve(data.Functions) : getAllFunctions(data.NextMarker)
        .then(functions => resolve(functions.concat(data.Functions)))
        .catch(reject)
    }));

  const appendTags = (functions) => Promise
    .all(functions.map(f => new Promise((resolve, reject) => lambda.listTags({
      Resource: f.FunctionArn
    }, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(Object.assign(f, res));
    }))));

  const setCloudWatchRetention = (f, retentionInDays = 30) => new Promise((resolve, reject) => cloudwatchlogs
    .putRetentionPolicy({
      logGroupName: `/aws/lambda/${f.FunctionName}`,
      retentionInDays
    }, (err, resp) => {
      if (err) {
        return reject(err);
      }
      return resolve(resp);
    })
  );

  return {
    getAllFunctions,
    appendTags,
    setCloudWatchRetention
  };
};
