const rollbar = require("lambda-rollbar")({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.ENVIRONMENT,
  enabled: process.env.ENABLE_ROLLBAR === "true",
  captureUncaught: true,
  captureUnhandledRejections: true
});
const zlibPromise = require("./util/zlibPromise");

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
  .then((result) => {
    const resultParsed = JSON.parse(result.toString('ascii'));
    const parsedEvents = resultParsed.logEvents
      .map(logEvent => ({
        message: logEvent.message,
        logGroupName: resultParsed.logGroup,
        logStreamName: resultParsed.logStream,
        "@timestamp": new Date(logEvent.timestamp).toISOString()
      }));

    parsedEvents.forEach((e) => {
      const requestLog = requestLogRegex.exec(e.message);
      if (requestLog) {
        const requestInfo = {
          requestId: requestLog[1],
          duration: requestLog[2],
          maxTime: requestLog[3],
          maxMemory: requestLog[4],
          memory: requestLog[5]
        };
        // todo: log to logging services
        // console.log(requestInfo);
      } else if (!e.message.match(requestEndRegex) && !e.message.match(requestStartRegex)) {
        rb.warning(e);
      }
    });

    callback(null, parsedEvents);
  })
  .catch(callback));
