const request = require('../singleton/request');

module.exports = (context, logs) => {
  if (process.env.LOGGLY_TOKEN === undefined || logs.length === 0) {
    return;
  }
  request.enqueue({
    method: 'POST',
    uri: `https://logs-01.loggly.com/bulk/${process.env.LOGGLY_TOKEN}/tag/${process.env.ENVIRONMENT}/`,
    body: logs.map(JSON.stringify).join('\n'),
    resolveWithFullResponse: true
  });
};
