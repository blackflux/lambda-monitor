const request = require('request-promise');

module.exports.log = (context, environment, logs) => {
  if (process.env.DATADOG_API_KEY === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  const series = [];

  logs.forEach((log) => {
    ['duration', 'maxMemory', 'initDuration']
      .filter((key) => ![null, undefined].includes(log[key]))
      .forEach((key) => {
        series.push({
          metric: `aws.lambda_monitor.lambda.${key.toLowerCase()}`,
          points: [[Date.parse(log.timestamp), [Math.round(log[key])]]],
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
