import s3PutGzipObject from '../singleton/s3-put-gzip-object.js';

export default ({ logGroup, message }) => {
  let messageParsed;
  try {
    messageParsed = JSON.parse(message);
    const { key, data } = messageParsed;
    s3PutGzipObject.enqueue(
      process.env.LOG_BUCKET_NAME,
      `${logGroup.slice(1)}/${key}`,
      JSON.stringify(data)
    );
  } catch (e) { /* ignored */ }
};
