import zlib from 'zlib';
import metricLogger from './logger/metric.js';
import messageLogger from './logger/message.js';
import { flushAll } from './logger/singleton.js';
import {
  isRequestStartOrEnd,
  extractRequestMeta,
  extractLogMessage,
  generateExecutionReport
} from './util/parser.js';
import Config from '../config.js';

const config = Config(process.env.CONFIG_FILEPATH);

const processLogs = async (event, context) => {
  const data = JSON.parse(zlib
    .gunzipSync(Buffer.from(event.awslogs.data, 'base64'))
    .toString('ascii'));

  const logEvents = data.logEvents
    .filter(({ message }) => !isRequestStartOrEnd(message))
    .filter(({ message }) => !config.isSuppressed(message))
    .map((logEvent) => [logEvent, extractRequestMeta(logEvent.message)]);

  const messageLogs = logEvents.filter(([logEvent, requestMeta]) => requestMeta === null);
  messageLogs
    .map(([logEvent]) => {
      const { targets, logLevel, message } = extractLogMessage(logEvent.message, data.logGroup);
      return [{ ...logEvent, message }, logLevel, targets];
    })
    .forEach(([logEvent, logLevel, targets]) => {
      const args = {
        logEvent,
        logGroup: data.logGroup,
        logStream: data.logStream,
        level: logLevel,
        message: logEvent.message,
        timestamp: Math.floor(logEvent.timestamp / 1000),
        timestampMS: logEvent.timestamp,
        types: targets
      };
      targets.forEach((target) => {
        messageLogger(target, args);
      });
    });

  const metricLogs = await Promise.all(logEvents
    .filter(([logEvent, requestMeta]) => requestMeta !== null)
    .map(([logEvent, requestMeta]) => generateExecutionReport(data, logEvent, requestMeta)));
  metricLogger(context, metricLogs);

  await flushAll(context);
  return data;
};

export default processLogs;
