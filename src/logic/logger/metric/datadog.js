const datadogDistributionMetric = require('../singleton/datadog-distribution-metric');

module.exports = (context, logs) => {
  logs.forEach((log) => {
    Object.entries({
      init_duration: log.initDuration,
      execution_duration: log.duration,
      memory_percentage: (log.maxMemory * 100) / log.memory,
      execution_duration_percentage: (log.duration * 100) / (log.timeout * 1000),
      code_size: log.codeSize
    })
      .filter(([key, value]) => ![null, undefined, NaN, Infinity].includes(value))
      .forEach(([key, value]) => {
        datadogDistributionMetric.enqueue(
          `aws.lambda_monitor.lambda.${key.toLowerCase()}`,
          { [Date.parse(log.timestamp)]: value },
          {
            tags: [
              `logGroupName:${log.logGroupName}`,
              `account:${log.owner}`
            ]
          }
        );
      });
  });
};
