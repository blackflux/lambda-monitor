const request = require("request");

module.exports.log = (environment, logs) => {
  if (process.env.LOGGLY_TOKEN === undefined || logs.length === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => request(
    {
      method: 'POST',
      uri: `https://logs-01.loggly.com/bulk/${process.env.LOGGLY_TOKEN}/tag/${environment}/`,
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
