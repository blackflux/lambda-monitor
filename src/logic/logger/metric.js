const path = require('path');
const fs = require('smart-fs');

const timeoutPromise = require('../util/timeout-promise');
const promiseComplete = require('../util/promise-complete');

const metricLogger = fs
  .walkDir(path.join(__dirname, 'metric'))
  .map((f) => [f.slice(0, -3), fs.smartRead(path.join(__dirname, 'metric', f))]);

module.exports = (context, environment, logs) => {
  const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
  return promiseComplete(metricLogger
    .map(([name, logger]) => timeoutPromise(logger(context, environment, logs), timeout, name)));
};
