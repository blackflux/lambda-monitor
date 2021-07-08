const assert = require('assert');
const crypto = require('crypto');
const request = require('../singleton/request');

const logLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

const loadToken = (logGroup) => {
  if (process.env.ROLLBAR_ACCESS_TOKEN === undefined) {
    return undefined;
  }
  const tokenData = process.env.ROLLBAR_ACCESS_TOKEN.split('|');
  for (let idx = 1; idx < tokenData.length - 1; idx += 2) {
    if (logGroup.startsWith(tokenData[idx])) {
      return tokenData[idx + 1];
    }
  }
  return tokenData[0];
};

module.exports = ({
  logGroup,
  logStream,
  level,
  message,
  timestamp
}) => {
  const token = loadToken(logGroup);
  if (token === undefined) {
    return;
  }
  const logLevelIdx = logLevels.indexOf(level.toUpperCase());
  assert(logLevelIdx !== -1);
  if (logLevels.indexOf(process.env.ROLLBAR_REPORT_LEVEL) > logLevelIdx) {
    return;
  }
  assert(typeof message === 'string');
  request.enqueue({
    method: 'POST',
    url: 'https://api.rollbar.com/api/1/item/',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      access_token: token,
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
