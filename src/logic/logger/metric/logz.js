import request from '../singleton/request.js';

export default (context, logs) => {
  if (process.env.LOGZ_TOKEN === undefined || logs.length === 0) {
    return;
  }
  request.enqueue({
    method: 'POST',
    headers: {
      'content-type': 'application/x-ndjson'
    },
    url: 'https://listener.logz.io:8071',
    params: {
      token: process.env.LOGZ_TOKEN,
      type: 'lambda-execution-info'
    },
    data: logs.map(JSON.stringify).join('\n')
      // Reference: http://tiny.cc/bru4oy
      .replace(/"timestamp":/g, '"@timestamp":')
  });
};
