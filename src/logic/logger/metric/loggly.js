import request from '../singleton/request.js';

export default (context, logs) => {
  if (process.env.LOGGLY_TOKEN === undefined || logs.length === 0) {
    return;
  }
  request.enqueue({
    method: 'POST',
    headers: {
      'content-type': 'application/x-ndjson'
    },
    url: `https://logs-01.loggly.com/bulk/${process.env.LOGGLY_TOKEN}/tag/${process.env.ENVIRONMENT}/`,
    data: logs.map(JSON.stringify).join('\n')
  });
};
