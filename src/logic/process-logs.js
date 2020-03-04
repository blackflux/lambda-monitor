const zlib = require('zlib');
const s3 = require('./util/s3');
const timeoutPromise = require('./util/timeout-promise');
const promiseComplete = require('./util/promise-complete');
const logz = require('./services/logz');
const loggly = require('./services/loggly');
const datadog = require('./services/datadog');
const rollbar = require('./util/rollbar');
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
        const { logLevel, message } = parser.extractLogMessage(logEvent.message, data.logGroup);
        const processedLogEvent = { ...logEvent, message };
        const [year, month, day] = new Date(processedLogEvent.timestamp).toISOString().split('T')[0].split('-');
        return Promise.all([
          s3.putGzipObject(
            process.env.LOG_STREAM_BUCKET_NAME,
            `${data.logGroup.slice(1)}/${year}/${month}/${day}/${logLevel}-${logEvent.id}.json.gz`,
            JSON.stringify(processedLogEvent)
          ),
          rollbar.submit({
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
      .then((toLog) => {
        const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
        return promiseComplete([
          timeoutPromise(logz.log(context, process.env.ENVIRONMENT, toLog), timeout, 'logz'),
          timeoutPromise(loggly.log(context, process.env.ENVIRONMENT, toLog), timeout, 'loggly'),
          timeoutPromise(datadog.log(context, process.env.ENVIRONMENT, toLog), timeout, 'datadog')
        ]);
      })
  ]);
  return data;
};

module.exports = processLogs;
