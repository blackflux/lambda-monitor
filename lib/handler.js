const rollbar = require("lambda-rollbar")({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.DEFAULT_ENVIRONMENT,
  enabled: process.env.ROLLBAR_ACCESS_TOKEN !== undefined
});
const processLogs = require("./logic/processLogs");

module.exports.processLogs = rollbar.wrap(processLogs);
