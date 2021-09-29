const { wrap: asyncWrap } = require('lambda-async');
const { wrap: cfnWrap } = require('lambda-cfn-hook');
const processLogs = require('./logic/process-logs');
const batcherHandler = require('./logic/batcher-handler');
const bundlerHandler = require('./logic/bundler-handler');
const subscribe = require('./logic/subscribe');
const emptyBucket = require('./logic/empty-bucket');

module.exports.batcherHandler = asyncWrap(batcherHandler);
module.exports.bundlerHandler = asyncWrap(bundlerHandler);
module.exports.processLogs = asyncWrap(processLogs);
module.exports.subscribe = cfnWrap(subscribe, { silent: true });
module.exports.emptyBucket = cfnWrap(emptyBucket);
