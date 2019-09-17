const get = require('lodash.get');
const request = require('request-promise');

module.exports = ({
  level,
  message,
  timestamp = Math.floor(new Date() / 1000)
}) => {
  if (process.env.VERBOSE === '1') {
    // eslint-disable-next-line no-console
    console.log(message);
  }
  return (get(process, 'env.ROLLBAR_ACCESS_TOKEN', '') === ''
    ? Promise.resolve()
    : request({
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
              body: message
            }
          },
          timestamp,
          fingerprint: message.split('\n')[0]
        }
      })
    }));
};
