const get = require('lodash.get');
const rollbar = require('lambda-rollbar')({
  verbose: process.env.VERBOSE === '1',
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.DEFAULT_ENVIRONMENT,
  enabled: process.env.ROLLBAR_ACCESS_TOKEN !== undefined,
  reportLevel: get(process.env, 'ROLLBAR_REPORT_LEVEL', 'WARNING').toLowerCase(),
  template: 'aws-cloud-watch'
});
const processLogs = require('./logic/process-logs');
const subscribe = require('./logic/subscribe');
const setRetention = require('./logic/set-retention');
const deleteBucket = require('./logic/delete-bucket');

const callbackify = (fn) => (event, context, rb) => new Promise((resolve, reject) => fn(
  event,
  context,
  (err, resp) => (err ? reject(err) : resolve(resp)),
  rb
));

module.exports.processLogs = rollbar.wrap(callbackify(processLogs));
module.exports.subscribe = rollbar.wrap(callbackify(subscribe));
module.exports.setRetention = rollbar.wrap(callbackify(setRetention));
module.exports.deleteBucket = rollbar.wrap(callbackify(deleteBucket));
