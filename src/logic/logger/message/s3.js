const s3PutGzipObject = require('../singleton/s3-put-gzip-object');

module.exports = ({ logGroup, message }) => {
  let messageParsed;
  try {
    messageParsed = JSON.parse(message);
    const { key, data } = messageParsed;
    s3PutGzipObject.enqueue(
      process.env.LOG_BUCKET_NAME,
      `${logGroup.slice(1)}/${key}`,
      JSON.stringify(data)
    );
  } catch (e) {
    /* ignored */
  }
};
