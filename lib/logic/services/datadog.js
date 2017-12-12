const tls = require('tls');

const host = "intake.logs.datadoghq.com";
const port = 10516;

module.exports.log = (environment, logs) => {
  if (process.env.DATADOG_API_KEY === undefined || logs.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const socket = new tls.TLSSocket();
    socket
      .connect(port, host, () => {
        const data = logs
          .map(log => ({
            message: log.message,
            aws: {
              function_name: log.logGroupName.split("/").pop(),
              memory_limit_in_mb: log.maxMemory,
              awslogs: {
                logGroup: log.logGroupName,
                logStream: log.logStreamName
              }
            }
          }))
          .map(log => `${process.env.DATADOG_API_KEY} ${JSON.stringify(log)}\n`)
          .join("")
          .toString("utf8");
        socket.write(data, 'utf8', () => socket.destroy());
      })
      .on('error', reject)
      .on('close', resolve);
  });
};
