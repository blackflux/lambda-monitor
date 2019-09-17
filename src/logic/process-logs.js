const zlib = require('zlib');
const get = require('lodash.get');
const defaults = require('lodash.defaults');
const rb = require('./util/rollbar');
const s3 = require('./util/s3');
const timeoutPromise = require('./util/timeout-promise');
const promiseComplete = require('./util/promise-complete');
const logz = require('./services/logz');
const loggly = require('./services/loggly');
const datadog = require('./services/datadog');

const requestLogRegex = new RegExp([
  /^REPORT RequestId: (?<requestId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\t/,
  /Duration: (?<duration>\d+.\d+) ms\t/,
  /Billed Duration: (?<billedDuration>\d+) ms\t/,
  /Memory Size: (?<memory>\d+) MB\t/,
  /Max Memory Used: (?<maxMemory>\d+) MB\t/,
  /(?:Init Duration: (?<initDuration>\d+.\d+) ms\t)?\n/,
  // https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html
  /XRAY TraceId: (?<traceId>\d+-[0-9a-f]{8}-[0-9a-f]{24})\t/,
  /SegmentId: (?<segmentId>[0-9a-f]{16})\t/,
  /Sampled: (?<sampled>true|false)\t\n?$/
].map((r) => r.source).join(''), '');
const requestStartRegex = new RegExp([
  /^START RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} /,
  /Version: (\$LATEST|\d+)\n$/
].map((r) => r.source).join(''), '');
const requestEndRegex = new RegExp([
  /^END RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\n$/
].map((r) => r.source).join(''), '');
const genericPrefix = new RegExp([
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z[\s\t]/,
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[\s\t]/,
  /INFO[\s\t]/
].map((r) => r.source).join(''), '');
const requestLogLevel = new RegExp([
  /^(?<logLevel>DEBUG|INFO|WARNING|ERROR|CRITICAL):/
].map((r) => r.source).join(''), '');

const getToLog = async (resultParsed) => {
  const result = [];
  await Promise.all(resultParsed.logEvents.map(async (logEvent) => {
    const requestLog = requestLogRegex.exec(logEvent.message);
    if (requestLog) {
      const {
        duration, billedDuration, maxMemory, requestId, memory, initDuration, traceId, segmentId, sampled
      } = requestLog.groups;
      result.push({
        message: logEvent.message,
        logGroupName: resultParsed.logGroup,
        logStreamName: resultParsed.logStream,
        owner: resultParsed.owner,
        timestamp: new Date(logEvent.timestamp).toISOString(),
        requestId,
        duration: parseFloat(duration),
        billedDuration: parseInt(billedDuration, 10),
        maxMemory: parseInt(maxMemory, 10),
        memory: parseInt(memory, 10),
        initDuration: initDuration === undefined ? null : parseFloat(initDuration),
        traceId,
        segmentId,
        sampled,
        env: process.env.ENVIRONMENT
      });
    } else if (!logEvent.message.match(requestEndRegex) && !logEvent.message.match(requestStartRegex)) {
      const processedLogEvent = defaults({ message: logEvent.message.replace(genericPrefix, '') }, logEvent);
      const logLevel = get(
        requestLogLevel.exec(processedLogEvent.message),
        'groups.logLevel',
        'WARNING'
      ).toLowerCase();
      const [year, month, day] = new Date(processedLogEvent.timestamp).toISOString().split('T')[0].split('-');
      await Promise.all([
        s3.putGzipObject(
          process.env.LOG_STREAM_BUCKET_NAME,
          `${resultParsed.logGroup.slice(1)}/${year}/${month}/${day}/${logLevel}-${logEvent.id}.json.gz`,
          JSON.stringify(processedLogEvent)
        ),
        rb({
          level: logLevel,
          message: processedLogEvent.message,
          timestamp: Math.floor(processedLogEvent.timestamp / 1000)
        })
      ]);
    }
  }));
  return result;
};

const processLogs = async (event, context) => {
  const resultParsed = JSON.parse(zlib
    .gunzipSync(Buffer.from(event.awslogs.data, 'base64'))
    .toString('ascii'));

  const toLog = await getToLog(resultParsed);
  const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
  await promiseComplete([
    timeoutPromise(logz.log(context, process.env.ENVIRONMENT, toLog), timeout, 'logz'),
    timeoutPromise(loggly.log(context, process.env.ENVIRONMENT, toLog), timeout, 'loggly'),
    timeoutPromise(datadog.log(context, process.env.ENVIRONMENT, toLog), timeout, 'datadog')
  ]);
  return resultParsed;
};

module.exports = async (event, context, callback) => {
  try {
    callback(null, await processLogs(event, context));
  } catch (err) {
    callback(err);
  }
};
