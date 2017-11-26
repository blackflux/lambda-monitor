const rollbar = require("lambda-rollbar")({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.DEFAULT_ENVIRONMENT,
  enabled: process.env.ROLLBAR_ACCESS_TOKEN !== undefined
});
const processLogs = require("./logic/processLogs");
const subscribe = require("./logic/subscribe");
const setRetention = require("./logic/setRetention");

module.exports.processLogs = rollbar.wrap(processLogs);
module.exports.subscribe = rollbar.wrap(subscribe);
module.exports.setRetention = rollbar.wrap(setRetention);
