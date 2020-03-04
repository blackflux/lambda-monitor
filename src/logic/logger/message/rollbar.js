const assert = require('assert');
const crypto = require('crypto');
const request = require('request-promise-native');

const logLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

module.exports.submit = async ({
  logGroup,
  logStream,
  level,
  message,
  timestamp
}) => {
  if (process.env.ROLLBAR_ACCESS_TOKEN === undefined) {
    return;
  }
  const logLevelIdx = logLevels.indexOf(level.toUpperCase());
  assert(logLevelIdx !== -1);
  if (logLevels.indexOf(process.env.ROLLBAR_REPORT_LEVEL) > logLevelIdx) {
    return;
  }
  assert(typeof message === 'string');
  await request({
    method: 'POST',
    url: 'https://api.rollbar.com/api/1/item/',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      access_token: process.env.ROLLBAR_ACCESS_TOKEN,
      data: {
        level,
        environment: process.env.ENVIRONMENT,
        body: {
          message: {
            body: message,
            logGroup,
            url: `https://console.aws.amazon.com/cloudwatch/home#logEventViewer:group=${logGroup};stream=${logStream}`
          }
        },
        timestamp,
        fingerprint: crypto
          .createHash('md5')
          .update(logGroup)
          .update(message.split(/[\n\r]/)[0])
          .digest('hex')
      }
    })
  });
};
