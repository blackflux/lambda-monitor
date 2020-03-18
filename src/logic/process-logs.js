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
      const { targets, logLevel, message } = parser.extractLogMessage(logEvent.message, data.logGroup);
      return [{ ...logEvent, message }, logLevel, targets];
    })
    .forEach(([logEvent, logLevel, targets]) => {
      const args = {
        logEvent,
        logGroup: data.logGroup,
        logStream: data.logStream,
        level: logLevel,
        message: logEvent.message,
        timestamp: Math.floor(logEvent.timestamp / 1000)
      };
      targets.forEach((target) => {
        messageLogger(target, args);
      });
    });

  const metricLogs = await Promise.all(logEvents
    .filter(([logEvent, requestMeta]) => requestMeta !== null)
    .map(([logEvent, requestMeta]) => parser.generateExecutionReport(data, logEvent, requestMeta)));
  metricLogger(context, process.env.ENVIRONMENT, metricLogs);

  await singletonLogger.flushAll();
  return data;
};

module.exports = processLogs;
