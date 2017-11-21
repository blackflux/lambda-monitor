const zlib = require('zlib');

const parseEvent = (logEvent, logGroupName, logStreamName) => ({
  message: logEvent.message.substring(0, logEvent.message.length),
  logGroupName,
  logStreamName,
  "@timestamp": new Date(logEvent.timestamp).toISOString()
});

module.exports.processLogs = (event, context, callback) => {
  const payload = new Buffer(event.awslogs.data, 'base64');

  zlib.gunzip(payload, (error, result) => {
    if (error) {
      callback(error);
    } else {
      const resultParsed = JSON.parse(result.toString('ascii'));
      const parsedEvents = resultParsed.logEvents.map((logEvent) =>
        parseEvent(logEvent, resultParsed.logGroup, resultParsed.logStream));

      callback(null, parsedEvents)
    }
  });
};
