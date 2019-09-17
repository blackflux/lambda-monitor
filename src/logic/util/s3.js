const zlib = require('zlib');
const aws = require('aws-sdk-wrap')();
const rb = require('./rollbar');

const s3 = aws.get('s3');

const listObjectsV2 = (p) => s3.listObjectsV2(p).promise();
const deleteObjects = (p) => s3.deleteObjects(p).promise();

module.exports.putGzipObject = (bucket, key, data) => aws.call('s3:putObject', {
  ContentType: 'application/json',
  ContentEncoding: 'gzip',
  Bucket: bucket,
  Key: key,
  Body: zlib.gzipSync(data, { level: 9 })
});

module.exports.emptyBucket = async (objParams,) => {
  await rb({
    level: 'info',
    message: `emptyBucket(): ${JSON.stringify(objParams)}`
  });
  const result = await listObjectsV2(objParams);
  if (result.Contents.length === 0) {
    return Promise.resolve();
  }
  const objectList = result.Contents.map((c) => ({ Key: c.Key }));
  await rb({
    level: 'info',
    message: `Deleting ${objectList.length} items...`
  });
  const data = await deleteObjects({
    Bucket: objParams.Bucket,
    Delete: {
      Objects: objectList
    }
  });
  await rb({
    level: 'info',
    message: `Deleted ${data.Deleted.length} items ok.`
  });
  if (result.IsTruncated) {
    return this.emptyBucket({
      Bucket: objParams.Bucket,
      ContinuationToken: result.NextContinuationToken
    });
  }
  return Promise.resolve();
};
