const { wrap: asyncWrap } = require('lambda-async');
const { wrap: cfnWrap } = require('lambda-cfn-hook');
const processLogs = require('./logic/process-logs');
const subscribe = require('./logic/subscribe');
const setRetention = require('./logic/set-retention');
const emptyBucket = require('./logic/empty-bucket');

module.exports.processLogs = asyncWrap(processLogs);
module.exports.subscribe = cfnWrap(subscribe, { silent: true });
module.exports.setRetention = cfnWrap(setRetention, { silent: true });
module.exports.emptyBucket = cfnWrap(emptyBucket);
