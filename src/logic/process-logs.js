const get = require('lodash.get');
const defaults = require('lodash.defaults');
const zlibPromise = require('./util/zlib-promise');
const timeoutPromise = require('./util/timeout-promise');
const promiseComplete = require('./util/promise-complete');
const logz = require('./services/logz');
const loggly = require('./services/loggly');
const datadog = require('./services/datadog');

const requestLogRegex = new RegExp([
  /^REPORT RequestId: (?<requestId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\t/,
  /Duration: (?<duration>\d+.\d+) ms\t/,
  /Billed Duration: (?<billedDuration>\d+) ms\s?\t/,
  /Memory Size: (?<maxMemory>\d+) MB\t/,
  /Max Memory Used: (?<memory>\d+) MB\t/,
  /(?:Init Duration: (?<initDuration>\d+.\d+) ms\t)?\n/,
  // https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html
  // TODO: Make required and split into multiple lines.
  // eslint-disable-next-line max-len
  /(?:XRAY TraceId: (?<traceId>\d+-[0-9a-f]{8}-[0-9a-f]{24})\tSegmentId: (?<segmentId>[0-9a-f]{16})\tSampled: (?<sampled>true|false)\t\n)?$/
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
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[\s\t]/
].map((r) => r.source).join(''), '');
const requestLogLevel = new RegExp([
  /^(?<logLevel>DEBUG|INFO|WARNING|ERROR|CRITICAL):/
].map((r) => r.source).join(''), '');

module.exports = (event, context, callback, rb) => zlibPromise
  .gunzip(Buffer.from(event.awslogs.data, 'base64'))
  .then((r) => r.toString('ascii'))
  .then(JSON.parse)
  .then((resultParsed) => {
    const toLog = [];
    resultParsed.logEvents.forEach((logEvent) => {
      const requestLog = requestLogRegex.exec(logEvent.message);
      if (requestLog) {
        const {
          duration, billedDuration, maxMemory, requestId, memory, initDuration, traceId, segmentId, sampled
        } = requestLog.groups;
        toLog.push({
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
          traceId: traceId === undefined ? null : traceId,
          segmentId: segmentId === undefined ? null : segmentId,
          sampled: sampled === undefined ? null : sampled,
          env: process.env.ENVIRONMENT
        });
      } else if (!logEvent.message.match(requestEndRegex) && !logEvent.message.match(requestStartRegex)) {
        const processedLogEvent = defaults({ message: logEvent.message.replace(genericPrefix, '') }, logEvent);
        const logLevel = get(
          requestLogLevel.exec(processedLogEvent.message),
          'groups.logLevel',
          'WARNING'
        ).toLowerCase();
        rb[logLevel](processedLogEvent, process.env.ENVIRONMENT);
      }
    });
    return [resultParsed, toLog];
  })
  .then(([resultParsed, toLog]) => {
    const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
    return promiseComplete([
      timeoutPromise(logz.log(context, process.env.ENVIRONMENT, toLog), timeout, 'logz'),
      timeoutPromise(loggly.log(context, process.env.ENVIRONMENT, toLog), timeout, 'loggly'),
      timeoutPromise(datadog.log(context, process.env.ENVIRONMENT, toLog), timeout, 'datadog')
    ]).then(() => resultParsed);
  })
  .then((resultParsed) => callback(null, resultParsed))
  .catch(callback);
