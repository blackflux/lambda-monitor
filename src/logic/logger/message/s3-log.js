const s3PutGzipObject = require('../singleton/s3-put-gzip-object');

module.exports = ({
  logGroup,
  logEvent,
  level
}) => {
  const [year, month, day, hour] = new Date(logEvent.timestamp)
    .toISOString().split(/[-T:]/);
  s3PutGzipObject.enqueue(
    process.env.LOG_STREAM_BUCKET_NAME,
    `${logGroup.slice(1)}/${year}/${month}/${day}/${hour}/${level}-${logEvent.id}.json.gz`,
    JSON.stringify(logEvent)
  );
};
