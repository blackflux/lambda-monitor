import datadogDistributionMetric from '../singleton/datadog-distribution-metric.js';

export default (context, logs) => {
  logs.forEach((log) => {
    Object.entries({
      // todo: not perfect since in theory the function could finish
      timeout: log.timeout * 1000 <= log.initDuration + log.duration ? 1 : undefined,
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
