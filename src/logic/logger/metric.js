const path = require('path');
const fs = require('smart-fs');

const metricLogger = fs
  .walkDir(path.join(__dirname, 'metric'))
  .map((f) => [f.slice(0, -3), fs.smartRead(path.join(__dirname, 'metric', f))]);

module.exports = (context, environment, logs) => {
  return metricLogger.map(([name, logger]) => logger(context, environment, logs));
};
