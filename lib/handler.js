const rollbar = require("lambda-rollbar")({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.DEFAULT_ENVIRONMENT,
  enabled: process.env.ENABLE_ROLLBAR === "true"
});
const get = require("lodash.get");
const zlibPromise = require("./util/zlibPromise");
const lambda = require("./util/lambda");
const logz = require("./util/logz");

const requestLogRegex = new RegExp([
  /^REPORT RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\t/,
  /Duration: (\d+.\d+) ms\t/,
  /Billed Duration: (\d+) ms \t/,
  /Memory Size: (\d+) MB\t/,
  /Max Memory Used: (\d+) MB\t\n$/
].map(r => r.source).join(''), 'g');
const requestStartRegex = new RegExp([
  /^START RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} /,
  /Version: (\$LATEST|\d+)\n$/g
].map(r => r.source).join(''), 'g');
const requestEndRegex = new RegExp([
  /^END RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\n$/
].map(r => r.source).join(''), 'g');

module.exports.processLogs = rollbar.wrap((event, context, callback, rb) => zlibPromise
  .gunzip(Buffer.from(event.awslogs.data, 'base64'))
  .then(r => r.toString("ascii"))
  .then(JSON.parse)
  .then(resultParsed => lambda.getDetailsCached(resultParsed.logGroup)
    .then(details => [get(details, "Tags.STAGE", process.env.DEFAULT_ENVIRONMENT), resultParsed]))
  .then(([environment, resultParsed]) => {
    const toLog = [];
    resultParsed.logEvents.forEach((logEvent) => {
      const requestLog = requestLogRegex.exec(logEvent.message);
      if (requestLog) {
        toLog.push({
          message: logEvent.message,
          logGroupName: resultParsed.logGroup,
          logStreamName: resultParsed.logStream,
          "@timestamp": new Date(logEvent.timestamp).toISOString(),
          requestId: requestLog[1],
          duration: requestLog[2],
          billedDuration: requestLog[3],
          maxMemory: requestLog[4],
          memory: requestLog[5]
        });
      } else if (!logEvent.message.match(requestEndRegex) && !logEvent.message.match(requestStartRegex)) {
        rb.warning(logEvent, environment);
      }
    });
    return [environment, resultParsed, toLog];
  })
  .then(([environment, resultParsed, toLog]) => logz.log(environment, toLog).then(() => resultParsed))
  .then(resultParsed => callback(null, resultParsed))
  .catch(callback));
