const request = require('request-promise-native');

module.exports.log = (context, environment, logs) => {
  if (process.env.LOGZ_TOKEN === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  return request({
    method: 'POST',
    uri: 'https://listener.logz.io:8071',
    qs: {
      token: process.env.LOGZ_TOKEN,
      type: 'lambda-execution-info'
    },
    body: logs.map(JSON.stringify).join('\n')
      // Reference: http://tiny.cc/bru4oy
      .replace(/"timestamp":/g, '"@timestamp":'),
    resolveWithFullResponse: true
  });
};
