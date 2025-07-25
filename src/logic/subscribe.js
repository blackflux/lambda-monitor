import get from 'lodash.get';
import { logger } from 'lambda-monitor-logger';
import Lambda from './util/lambda.js';
import { filterPattern } from '../vars.js';

const lambda = Lambda();

export default () => lambda
  .getAllFunctions({
    TagFilters: [{
      Key: 'STAGE',
      Values: [process.env.ENVIRONMENT]
    }]
  })
  .then(lambda.appendLogSubscriptionInfo)
  .then((functions) => {
    const monitor = functions.find((f) => get(f, 'Tags.MONITOR', null) === '1');
    const monitored = functions
      .filter((f) => get(f, 'Tags.MONITORED', null) !== '0')
      .filter((f) => f.subscriptionFilters.every((e) => (
        e.destinationArn !== monitor.FunctionARN
        || e.filterPattern !== filterPattern
      )));
    return Promise.all(monitored.map((producer) => lambda.subscribeCloudWatchLogGroup(monitor, producer)));
  }).catch((e) => {
    if (e.name === 'ThrottlingException') {
      logger.error('CloudWatch subscription logic temporarily throttled by AWS.');
    } else {
      throw e;
    }
  });
