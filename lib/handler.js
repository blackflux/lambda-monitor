const zlibPromise = require("./util/zlibPromise");

module.exports.processLogs = (event, context, callback) => zlibPromise
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

    callback(null, parsedEvents);
  })
  .catch(callback);
