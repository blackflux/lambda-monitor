const zlib = require('zlib');
const aws = require('aws-sdk-wrap')();

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

module.exports.emptyBucket = (objParams, logger) => {
  logger.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  return listObjectsV2(objParams).then((result) => {
    if (result.Contents.length === 0) {
      return Promise.resolve();
    }
    const objectList = result.Contents.map((c) => ({ Key: c.Key }));
    logger.info(`Deleting ${objectList.length} items...`);
    return deleteObjects({
      Bucket: objParams.Bucket,
      Delete: {
        Objects: objectList
      }
    }).then((data) => {
      logger.info(`Deleted ${data.Deleted.length} items ok.`);
      if (result.IsTruncated) {
        return this.emptyBucket({
          Bucket: objParams.Bucket,
          ContinuationToken: result.NextContinuationToken
        }, logger);
      }
      return Promise.resolve();
    });
  });
};
