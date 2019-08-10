const tls = require('tls');

const host = 'intake.logs.datadoghq.com';
const port = 10516;

module.exports.log = (context, environment, logs) => {
  if (process.env.DATADOG_API_KEY === undefined || logs.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // Reference: http://tiny.cc/hn0fpy
    const socket = new tls.TLSSocket();
    socket
      .connect(port, host, () => {
        const data = logs
          .map((log) => ({
            message: log.message,
            ddsource: 'lambda',
            ddsourcecategory: 'aws',
            aws: {
              // about submitting function
              function_name: context.function_name,
              function_version: context.function_version,
              invoked_function_arn: context.invoked_function_arn,
              memory_limit_in_mb: context.memory_limit_in_mb,
              awslogs: {
                // about log submitted
                logGroup: log.logGroupName,
                logStream: log.logStreamName,
                owner: log.owner
              }
            },
            // log details
            timestamp: log.timestamp,
            context: log
          }))
          .map((log) => `${process.env.DATADOG_API_KEY} ${JSON.stringify(log)}\n`)
          .join('')
          .toString('utf8');
        socket.write(data, 'utf8', () => socket.destroy());
      })
      .on('error', reject)
      .on('close', resolve);
  });
};
