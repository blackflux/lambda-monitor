const zlib = require('zlib');
const s3 = require('./util/s3');
const timeoutPromise = require('./util/timeout-promise');
const promiseComplete = require('./util/promise-complete');
const logz = require('./services/logz');
const loggly = require('./services/loggly');
const datadog = require('./services/datadog');
const rollbar = require('./util/rollbar');
const parser = require('./util/parser');

const getToLog = async (resultParsed) => {
  const result = [];
  await Promise.all(resultParsed.logEvents.map(async (logEvent) => {
    if (parser.isRequestStartOrEnd(logEvent.message)) {
      return;
    }
    const report = await parser.extractExecutionReport(resultParsed, logEvent);
    if (report !== null) {
      result.push(report);
      return;
    }
    const { logLevel, message } = parser.extractLogMessage(logEvent.message, resultParsed.logGroup);
    const processedLogEvent = { ...logEvent, message };
    const [year, month, day] = new Date(processedLogEvent.timestamp).toISOString().split('T')[0].split('-');
    await Promise.all([
      s3.putGzipObject(
        process.env.LOG_STREAM_BUCKET_NAME,
        `${resultParsed.logGroup.slice(1)}/${year}/${month}/${day}/${logLevel}-${logEvent.id}.json.gz`,
        JSON.stringify(processedLogEvent)
      ),
      rollbar.submit({
        logGroup: resultParsed.logGroup,
        logStream: resultParsed.logStream,
        level: logLevel,
        message: processedLogEvent.message,
        timestamp: Math.floor(processedLogEvent.timestamp / 1000)
      })
    ]);
  }));
  return result;
};

const processLogs = async (event, context) => {
  const data = JSON.parse(zlib
    .gunzipSync(Buffer.from(event.awslogs.data, 'base64'))
    .toString('ascii'));

  const toLog = await getToLog(data);
  const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
  await promiseComplete([
    timeoutPromise(logz.log(context, process.env.ENVIRONMENT, toLog), timeout, 'logz'),
    timeoutPromise(loggly.log(context, process.env.ENVIRONMENT, toLog), timeout, 'loggly'),
    timeoutPromise(datadog.log(context, process.env.ENVIRONMENT, toLog), timeout, 'datadog')
  ]);
  return data;
};

module.exports = processLogs;
