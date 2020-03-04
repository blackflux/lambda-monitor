const zlib = require('zlib');
const LRU = require('lru-cache-ext');
const s3 = require('./util/s3');
const Lambda = require('./util/lambda');
const timeoutPromise = require('./util/timeout-promise');
const promiseComplete = require('./util/promise-complete');
const logz = require('./services/logz');
const loggly = require('./services/loggly');
const datadog = require('./services/datadog');
const rollbar = require('./util/rollbar');

const lambda = Lambda();
const lru = new LRU({ maxAge: 60 * 60 * 1000 });

const isRequestStartOrEnd = (() => {
  const requestStartRegex = new RegExp([
    /^START RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} /,
    /Version: (\$LATEST|\d+)\n$/
  ].map((r) => r.source).join(''), '');
  const requestEndRegex = new RegExp([
    /^END RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\n$/
  ].map((r) => r.source).join(''), '');
  return (message) => message.match(requestEndRegex) || message.match(requestStartRegex);
})();

const extractReport = (() => {
  const reportRegex = new RegExp([
    /^/,
    /REPORT RequestId: (?<requestId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\t/,
    /Duration: (?<duration>\d+.\d+) ms\t/,
    /Billed Duration: (?<billedDuration>\d+) ms\t/,
    /Memory Size: (?<memory>\d+) MB\t/,
    /Max Memory Used: (?<maxMemory>\d+) MB\t/,
    /(?:Init Duration: (?<initDuration>\d+.\d+) ms\t)?/,
    /\n/,
    // https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html
    // eslint-disable-next-line max-len
    /(?:XRAY TraceId: (?<traceId>\d+-[0-9a-f]{8}-[0-9a-f]{24})\tSegmentId: (?<segmentId>[0-9a-f]{16})\tSampled: (?<sampled>true|false)\t\n)?/,
    /$/
  ].map((r) => r.source).join(''), '');
  return async (resultParsed, logEvent) => {
    const requestLog = reportRegex.exec(logEvent.message);
    if (!requestLog) {
      return null;
    }
    const {
      duration, billedDuration, maxMemory, requestId, memory, initDuration, traceId, segmentId, sampled
    } = requestLog.groups;
    const fnName = resultParsed.logGroup.replace(/^\/aws\/lambda\//, '');
    const info = await lru.memoize(
      `${resultParsed.logStream}-${fnName}`,
      () => lambda.getFunctionConfiguration(fnName)
    );
    return {
      message: logEvent.message,
      logGroupName: resultParsed.logGroup,
      logStreamName: resultParsed.logStream,
      owner: resultParsed.owner,
      timestamp: new Date(logEvent.timestamp).toISOString(),
      requestId,
      duration: parseFloat(duration),
      timeout: info.Timeout,
      codeSize: info.CodeSize,
      billedDuration: parseInt(billedDuration, 10),
      maxMemory: parseInt(maxMemory, 10),
      memory: parseInt(memory, 10),
      initDuration: initDuration === undefined ? null : parseFloat(initDuration),
      traceId: traceId === undefined ? null : traceId,
      segmentId: segmentId === undefined ? null : segmentId,
      sampled: sampled === undefined ? null : sampled,
      env: process.env.ENVIRONMENT
    };
  };
})();

const parseMessage = (() => {
  const messageRegex = new RegExp([
    /^/,
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z[\s\t]/,
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[\s\t]/,
    /(?:(?:ERROR|INFO)[\s\t])?/,
    /(?:(?<logLevel>DEBUG|INFO|WARNING|ERROR|CRITICAL): )?/,
    /(?<message>[\s\S]*)/,
    /$/
  ].map((r) => r.source).join(''), '');

  return (message, logGroup) => {
    const messageParsed = messageRegex.exec(message);
    if (messageParsed) {
      return {
        logLevel: (messageParsed.groups.logLevel || 'WARNING').toLowerCase(),
        message: messageParsed.groups.message.replace(
          /^Task timed out after (\d+\.\d)\d seconds/,
          `${logGroup.replace(/^\/aws\/lambda\//, '')}: Task timed out after $1\u0030 seconds`
        )
      };
    }
    return {
      logLevel: 'WARNING'.toLowerCase(),
      message
    };
  };
})();

const getToLog = async (resultParsed) => {
  const result = [];
  await Promise.all(resultParsed.logEvents.map(async (logEvent) => {
    if (isRequestStartOrEnd(logEvent.message)) {
      return;
    }
    const report = await extractReport(resultParsed, logEvent);
    if (report !== null) {
      result.push(report);
      return;
    }
    const { logLevel, message } = parseMessage(logEvent.message, resultParsed.logGroup);
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

module.exports = processLogs;
