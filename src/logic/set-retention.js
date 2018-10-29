const lambda = require('./util/lambda')({
  region: process.env.REGION,
});
const cfnResponse = require('./util/cfn-response-wrapper');

const logGroupRetentionInDays = 30;

module.exports = cfnResponse.wrap((event, context, callback, rb) =>
  lambda
    .getAllFunctions({
      TagFilters: [
        {
          Key: 'STAGE',
          Values: [process.env.STAGE],
        },
      ],
    })
    .then(lambda.appendLogRetentionInfo)
    .then(functions =>
      functions.filter(f =>
        f.logGroups.every(e => e.retentionInDays !== logGroupRetentionInDays),
      ),
    )
    .then(functions =>
      Promise.all(
        functions.map(f =>
          lambda.setCloudWatchRetention(f, logGroupRetentionInDays),
        ),
      )
        .then(() => callback(null, 'Done.'))
        .catch(callback),
    ),
);
