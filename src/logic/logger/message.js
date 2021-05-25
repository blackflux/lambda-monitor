const path = require('path');
const fs = require('smart-fs');
const datadogDistributionMetric = require('./singleton/datadog-distribution-metric');

const messageLogger = fs
  .walkDir(path.join(__dirname, 'message'))
  .reduce((p, f) => Object.assign(p, {
    [f.slice(0, -3)]: fs.smartRead(path.join(__dirname, 'message', f))
  }), {});

module.exports = (type, ...args) => {
  const [arg] = args;
  datadogDistributionMetric.enqueue(
    'aws.lambda_monitor.lambda.log_count',
    [arg.timestampMS],
    {
      tags: [
        `level:${arg.level}`,
        `fnName:${arg.logGroup.replace(/^\/aws\/lambda\//, '')}`,
        `type:${type}`
      ]
    }
  );
  messageLogger[type](...args);
};
