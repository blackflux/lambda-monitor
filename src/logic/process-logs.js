const zlib = require('zlib');
const s3 = require('./util/s3');
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

  await Promise.all([
    ...logEvents
      .filter(([logEvent, requestMeta]) => requestMeta === null)
      .map(([logEvent]) => {
        const { target, logLevel, message } = parser.extractLogMessage(logEvent.message, data.logGroup);
        if (target !== 'rollbar') {
          return messageLogger(target, message);
        }
        const processedLogEvent = { ...logEvent, message };
        const [year, month, day] = new Date(processedLogEvent.timestamp).toISOString().split('T')[0].split('-');
        return Promise.all([
          // todo: move into logger ?
          s3.putGzipObject(
            process.env.LOG_STREAM_BUCKET_NAME,
            `${data.logGroup.slice(1)}/${year}/${month}/${day}/${logLevel}-${logEvent.id}.json.gz`,
            JSON.stringify(processedLogEvent)
          ),
          messageLogger(target, {
            logGroup: data.logGroup,
            logStream: data.logStream,
            level: logLevel,
            message: processedLogEvent.message,
            timestamp: Math.floor(processedLogEvent.timestamp / 1000)
          })
        ]);
      }),
    Promise.all(logEvents
      .filter(([logEvent, requestMeta]) => requestMeta !== null)
      .map(([logEvent, requestMeta]) => parser.generateExecutionReport(data, logEvent, requestMeta)))
      .then((toLog) => metricLogger(context, process.env.ENVIRONMENT, toLog))
  ]);
  await singletonLogger.flushAll();
  return data;
};

module.exports = processLogs;
