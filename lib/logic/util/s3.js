const aws = require("aws-sdk");

const s3 = new aws.S3();

module.exports.deleteBucket = (bucketName, logger) => new Promise((resolve, reject) => s3
  .deleteBucket({ Bucket: bucketName }, (err) => {
    if (err) {
      logger.error(`${bucketName} failed to delete!`);
      return reject(err);
    }
    logger.info(`${bucketName} emptied and deleted!`);
    return resolve();
  }));

module.exports.emptyBucket = (objParams, logger) => new Promise((resolve, reject) => {
  logger.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  s3.listObjectsV2(objParams, (err, result) => {
    if (err) {
      return reject(err);
    }
    if (result.Contents.length === 0) {
      return resolve();
    }

    const objectList = result.Contents.map(c => ({ Key: c.Key }));
    logger.info(`Deleting ${objectList.length} items...`);
    return s3.deleteObjects({
      Bucket: objParams.Bucket,
      Delete: {
        Objects: objectList
      }
    }, (e, data) => {
      if (e) {
        return reject(e);
      }
      logger.info(`Deleted ${data.Deleted.length} items ok.`);

      if (result.IsTruncated) {
        return this.emptyBucket({
          Bucket: objParams.Bucket,
          ContinuationToken: result.NextContinuationToken
        }, logger).then(resolve).catch(reject);
      }
      return resolve();
    });
  });
});
