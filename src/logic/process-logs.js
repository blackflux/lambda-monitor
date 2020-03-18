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
  messageLogs.forEach(([logEvent]) => {
    const { target, logLevel, message } = parser.extractLogMessage(logEvent.message, data.logGroup);
    const processedLogEvent = { ...logEvent, message };
    messageLogger(target, {
      logGroup: data.logGroup,
      logStream: data.logStream,
      level: logLevel,
      message: processedLogEvent.message,
      timestamp: Math.floor(processedLogEvent.timestamp / 1000)
    });
    if (target === 'rollbar') {
      const [year, month, day] = new Date(processedLogEvent.timestamp).toISOString().split('T')[0].split('-');
      messageLogger(
        's3',
        process.env.LOG_STREAM_BUCKET_NAME,
        `${data.logGroup.slice(1)}/${year}/${month}/${day}/${logLevel}-${logEvent.id}.json.gz`,
        JSON.stringify(processedLogEvent)
      );
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
