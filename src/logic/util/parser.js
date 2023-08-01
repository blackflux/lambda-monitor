import LRU from 'lru-cache-ext';
import Lambda from './lambda.js';

const lambda = Lambda();
const lru = new LRU({
  ttl: 60 * 60 * 1000,
  max: 256
});

export const isRequestStartOrEnd = (() => {
  const requestStartRegex = new RegExp([
    /^START RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} /,
    /Version: (\$LATEST|\d+)\n$/
  ].map((r) => r.source).join(''), '');
  const requestEndRegex = new RegExp([
    /^END RequestId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\n$/
  ].map((r) => r.source).join(''), '');
  return (message) => message.match(requestEndRegex) || message.match(requestStartRegex);
})();

export const extractRequestMeta = (message) => new RegExp([
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
].map((r) => r.source).join(''), '').exec(message);

export const generateExecutionReport = async (logEntry, logEvent, requestMeta) => {
  const {
    duration, billedDuration, maxMemory, requestId, memory, initDuration, traceId, segmentId, sampled
  } = requestMeta.groups;
  const fnName = logEntry.logGroup.replace(/^\/aws\/lambda\//, '');
  const info = await lru.memoize(
    `${logEntry.logStream}-${fnName}`,
    () => lambda.getFunctionConfiguration(fnName)
  );
  return {
    message: logEvent.message,
    logGroupName: logEntry.logGroup,
    logStreamName: logEntry.logStream,
    owner: logEntry.owner,
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

export const extractLogMessage = (() => {
  const messageRegex = new RegExp([
    /^/,
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z[\s\t]/,
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[\s\t]/,
    /(?:(?:ERROR|INFO)[\s\t])?/,
    /(?:(?<logLevel>DEBUG|INFO|WARNING|ERROR|CRITICAL): )?/,
    /(?:(?<target>DATADOG|S3|JSON|EMAIL): )?/,
    /(?<message>[\s\S]*)/,
    /$/
  ].map((r) => r.source).join(''), '');

  const initRegex = /^INIT_START Runtime Version: /;

  return (message, logGroup) => {
    if (initRegex.test(message)) {
      return {
        targets: ['DATADOG'.toLowerCase()],
        logLevel: 'INFO'.toLowerCase(),
        message: JSON.stringify({
          type: 'distribution-metric',
          args: [
            'aws.lambda_monitor.lambda.init_start',
            [new Date() / 1],
            { tags: [`fnName:${logGroup.replace(/^\/aws\/lambda\//, '')}`] }
          ]
        })
      };
    }

    const result = {
      targets: ['ROLLBAR'.toLowerCase()],
      logLevel: 'WARNING'.toLowerCase(),
      message
    };
    const messageParsed = messageRegex.exec(message);
    if (messageParsed) {
      Object.assign(result, {
        targets: [(messageParsed.groups.target || 'ROLLBAR').toLowerCase()],
        logLevel: (messageParsed.groups.logLevel || 'WARNING').toLowerCase(),
        message: messageParsed.groups.message.replace(
          /^Task timed out after (\d+\.\d)\d seconds/,
          `${logGroup.replace(/^\/aws\/lambda\//, '')}: Task timed out after $1\u0030 seconds`
        )
      });
    }
    if (result.targets.includes('rollbar') && !result.targets.includes('sqs-batch')) {
      result.targets.push('sqs-batch');
    }
    result.targets.push('any-meta');
    return result;
  };
})();
