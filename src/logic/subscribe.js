const get = require('lodash.get');
const lambda = require('./util/lambda')({
  region: process.env.REGION,
});
const cfnResponse = require('./util/cfn-response-wrapper');

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
    .then(lambda.appendLogSubscriptionInfo)
    .then(functions => {
      const monitor = functions.find(f => get(f, 'Tags.MONITOR', null) === '1');
      const monitored = functions
        .filter(f => get(f, 'Tags.MONITORED', null) !== '0')
        .filter(f => {
          return f.subscriptionFilters.every(
            e => e.destinationArn !== monitor.FunctionARN,
          );
        });
      return Promise.all(
        monitored.map(producer =>
          lambda.subscribeCloudWatchLogGroup(monitor, producer),
        ),
      );
    })
    .then(() => callback(null, 'Done.'))
    .catch(callback),
);
