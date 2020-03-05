const request = require('request-promise-native');

module.exports = (context, environment, logs) => {
  if (process.env.LOGGLY_TOKEN === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  return request({
    method: 'POST',
    uri: `https://logs-01.loggly.com/bulk/${process.env.LOGGLY_TOKEN}/tag/${environment}/`,
    body: logs.map(JSON.stringify).join('\n'),
    resolveWithFullResponse: true
  });
};
