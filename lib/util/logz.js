const request = require("request");

const url = 'https://listener.logz.io:8071';

module.exports.log = (environment, logs) => {
  if (process.env.LOGZ_TOKEN === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => request(
    {
      method: 'POST',
      uri: url,
      qs: {
        token: process.env.LOGZ_TOKEN,
        type: environment
      },
      body: logs.map(JSON.stringify).join("\n")
    },
    (err, resp) => {
      if (err) {
        return reject(err);
      }
      if (resp.statusCode !== 200) {
        return reject(resp);
      }
      return resolve();
    }
  ));
};
