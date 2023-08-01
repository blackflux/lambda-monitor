import datadog from './metric/datadog.js';
import loggly from './metric/loggly.js';
import logz from './metric/logz.js';

const metricLogger = Object.entries({
  datadog,
  loggly,
  logz
});

export default (context, logs) => {
  metricLogger.forEach(([name, logger]) => {
    logger(context, logs);
  });
};
