const { wrap } = require('lambda-async');
const processLogs = require('./logic/process-logs');
const subscribe = require('./logic/subscribe');
const setRetention = require('./logic/set-retention');
const emptyBucket = require('./logic/empty-bucket');

const callbackify = (fn) => (event, context) => new Promise((resolve, reject) => fn(
  event,
  context,
  (err, resp) => (err ? reject(err) : resolve(resp))
));

module.exports.processLogs = wrap(callbackify(processLogs));
module.exports.subscribe = wrap(callbackify(subscribe));
module.exports.setRetention = wrap(callbackify(setRetention));
module.exports.emptyBucket = wrap(callbackify(emptyBucket));
