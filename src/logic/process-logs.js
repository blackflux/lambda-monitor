const zlib = require('zlib');
const metricLogger = require('./logger/metric');
const messageLogger = require('./logger/message');
const singletonLogger = require('./logger/singleton');
const parser = require('./util/parser');

const processLogs = async (event, context) => {
  const data = JSON.parse(zlib
    .gunzipSync(Buffer.from(event.awslogs.data, 'base64'))
    .toString('ascii'));

  const logEvents = data.logEvents
    .filter((logEvent) => !parser.isRequestStartOrEnd(logEvent.message))
    .map((logEvent) => [logEvent, parser.extractRequestMeta(logEvent.message)]);

  const messageLogs = logEvents.filter(([logEvent, requestMeta]) => requestMeta === null);
  messageLogs
    .map(([logEvent]) => {
      const { target, logLevel, message } = parser.extractLogMessage(logEvent.message, data.logGroup);
      return [{ ...logEvent, message }, logLevel, target];
    })
    .forEach(([logEvent, logLevel, target]) => {
      const args = {
        logEvent,
        logGroup: data.logGroup,
        logStream: data.logStream,
        level: logLevel,
        message: logEvent.message,
        timestamp: Math.floor(logEvent.timestamp / 1000)
      };
      messageLogger(target, args);
      if (target === 'rollbar') {
        messageLogger('s3', args);
      }
    });

  const metricLogs = await Promise.all(logEvents
    .filter(([logEvent, requestMeta]) => requestMeta !== null)
    .map(([logEvent, requestMeta]) => parser.generateExecutionReport(data, logEvent, requestMeta)));
  metricLogger(context, process.env.ENVIRONMENT, metricLogs);

  await singletonLogger.flushAll();
  return data;
};

module.exports = processLogs;
