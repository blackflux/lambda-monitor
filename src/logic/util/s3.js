const aws = require('aws-sdk');

const s3 = new aws.S3();

const listObjectsV2 = p => s3.listObjectsV2(p).promise();
const deleteObjects = p => s3.deleteObjects(p).promise();

module.exports.deleteBucket = p => s3.deleteBucket(p).promise();
module.exports.emptyBucket = (objParams, logger) => {
  logger.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  return listObjectsV2(objParams).then(result => {
    if (result.Contents.length === 0) {
      return Promise.resolve();
    }
    const objectList = result.Contents.map(c => ({ Key: c.Key }));
    logger.info(`Deleting ${objectList.length} items...`);
    return deleteObjects({
      Bucket: objParams.Bucket,
      Delete: {
        Objects: objectList,
      },
    }).then(data => {
      logger.info(`Deleted ${data.Deleted.length} items ok.`);
      if (result.IsTruncated) {
        return this.emptyBucket(
          {
            Bucket: objParams.Bucket,
            ContinuationToken: result.NextContinuationToken,
          },
          logger,
        );
      }
      return Promise.resolve();
    });
  });
};
