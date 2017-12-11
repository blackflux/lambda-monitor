const get = require("lodash.get");
const rollbar = require("lambda-rollbar")({
  verbose: process.env.VERBOSE === "1",
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.DEFAULT_ENVIRONMENT,
  enabled: process.env.ROLLBAR_ACCESS_TOKEN !== undefined,
  reportLevel: get(process.env, 'ROLLBAR_REPORT_LEVEL', "WARNING").toLowerCase(),
  template: 'aws-cloud-watch'
});
const processLogs = require("./logic/processLogs");
const subscribe = require("./logic/subscribe");
const setRetention = require("./logic/setRetention");
const deleteBucket = require("./logic/deleteBucket");

module.exports.processLogs = rollbar.wrap(processLogs);
module.exports.subscribe = rollbar.wrap(subscribe);
module.exports.setRetention = rollbar.wrap(setRetention);
module.exports.deleteBucket = rollbar.wrap(deleteBucket);
