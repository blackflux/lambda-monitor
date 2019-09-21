const lambda = require('./util/lambda')({
  region: process.env.AWS_REGION
});

const logGroupRetentionInDays = 30;

module.exports = () => lambda
  .getAllFunctions({
    TagFilters: [{
      Key: 'STAGE',
      Values: [process.env.ENVIRONMENT]
    }]
  })
  .then(lambda.appendLogGroupInfo)
  .then((functions) => functions
    .filter((f) => f.logGroup && f.logGroup.retentionInDays !== logGroupRetentionInDays))
  .then((functions) => Promise
    .all(functions.map((f) => lambda.setCloudWatchRetention(f, logGroupRetentionInDays))));
