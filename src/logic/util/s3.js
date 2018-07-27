const aws = require("aws-sdk");

const s3 = new aws.S3();

const promisfy = func => objParams => new Promise((resolve, reject) => s3[func](
  objParams,
  (err, result) => (err ? reject(err) : resolve(result))
));

const listObjectsV2 = promisfy("listObjectsV2");
const deleteObjects = promisfy("deleteObjects");

module.exports.deleteBucket = promisfy("deleteBucket");
module.exports.emptyBucket = (objParams, logger) => {
  logger.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  return listObjectsV2(objParams).then((result) => {
    if (result.Contents.length === 0) {
      return Promise.resolve();
    }
    const objectList = result.Contents.map(c => ({ Key: c.Key }));
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
