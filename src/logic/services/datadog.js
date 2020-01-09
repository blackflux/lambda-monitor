const request = require('request-promise');

module.exports.log = (context, environment, logs) => {
  if (process.env.DATADOG_API_KEY === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  const series = [];

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
        series.push({
          metric: `aws.lambda_monitor.lambda.${key.toLowerCase()}`,
          points: [[Date.parse(log.timestamp), [value]]],
          type: 'distribution',
          tags: [
            `logGroupName:${log.logGroupName}`,
            `account:${log.owner}`,
            `environment:${environment}`
          ]
        });
      });
  });

  return request({
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    uri: 'https://api.datadoghq.com/api/v1/distribution_points',
    qs: {
      api_key: process.env.DATADOG_API_KEY
    },
    json: true,
    body: { series }
  });
};
