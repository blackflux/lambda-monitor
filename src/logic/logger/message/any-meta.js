const datadogDistributionMetric = require('../singleton/datadog-distribution-metric');

module.exports = ({
  logGroup, level, types, timestampMS
}) => {
  types.forEach((type) => {
    if (type === 'any-meta') {
      return;
    }
    datadogDistributionMetric.enqueue(
      'aws.lambda_monitor.lambda.log_count',
      [timestampMS],
      {
        tags: [
          `level:${level}`,
          `fnName:${logGroup.replace(/^\/aws\/lambda\//, '')}`,
          `type:${type}`
        ]
      }
    );
  });
};
