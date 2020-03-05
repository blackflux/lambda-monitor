const Datadog = require('datadog-light');

module.exports = (context, environment, logs) => {
  if (process.env.DATADOG_API_KEY === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  const distributionMetric = Datadog(process.env.DATADOG_API_KEY).DistributionMetric;

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
        distributionMetric.enqueue(
          `aws.lambda_monitor.lambda.${key.toLowerCase()}`,
          { [Date.parse(log.timestamp)]: value },
          {
            tags: [
              `logGroupName:${log.logGroupName}`,
              `account:${log.owner}`,
              `environment:${environment}`
            ]
          }
        );
      });
  });

  return distributionMetric.flush();
};
