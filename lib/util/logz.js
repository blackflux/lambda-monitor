const request = require("request-promise");

module.exports.log = (environment, logs) => {
  if (process.env.LOGZ_TOKEN === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  return request({
    method: 'POST',
    uri: 'https://listener.logz.io:8071',
    qs: {
      token: process.env.LOGZ_TOKEN,
      type: environment
    },
    body: logs.map(JSON.stringify).join("\n")
      // Reference: http://tiny.cc/bru4oy
      .replace(/"timestamp":/g, "\"@timestamp\":"),
    resolveWithFullResponse: true
  });
};
