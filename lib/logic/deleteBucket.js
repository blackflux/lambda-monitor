const aws = require("aws-sdk");
const get = require("lodash.get");
const cfnResponse = require("./util/cfn-response-wrapper");

const s3 = new aws.S3();

const deleteBucket = (bucketName, rb) => new Promise((resolve, reject) => s3
  .deleteBucket({ Bucket: bucketName }, (err) => {
    rb.info(err ? `${bucketName} failed to delete!` : `${bucketName} emptied and deleted!`);
    return (err ? reject(err) : resolve());
  }));

const emptyBucket = (objParams, rb) => new Promise((resolve, reject) => {
  rb.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  s3.listObjectsV2(objParams, (err, result) => {
    if (err) {
      return reject(err);
    }

    if (result.Contents.length === 0) {
      return deleteBucket(objParams.Bucket, rb).then(resolve).catch(reject);
    }

    const objectList = result.Contents.map(c => ({ Key: c.Key }));
    rb.info(`Deleting ${objectList.length} items...`);
    return s3.deleteObjects({
      Bucket: objParams.Bucket,
      Delete: {
        Objects: objectList
      }
    }, (e, data) => {
      if (e) {
        return reject(e);
      }
      rb.info(`Deleted ${data.Deleted.length} items ok.`);

      if (result.isTruncated) {
        return emptyBucket({
          Bucket: objParams.Bucket,
          ContinuationToken: result.NextContinuationToken
        }, rb).then(resolve).catch(reject);
      }
      return deleteBucket(objParams.Bucket, rb).then(resolve).catch(reject);
    });
  });
});

module.exports = cfnResponse.wrap((event, context, callback, rb) => new Promise((resolve, reject) => {
  const requestType = get(event, 'RequestType');
  if (requestType === 'Delete') {
    const bucketName = get(event, "ResourceProperties.BucketName");
    if (bucketName === undefined) {
      return reject(new Error("No Bucket Provided."));
    }
    return emptyBucket({ Bucket: bucketName }, rb).then(resolve).catch(reject);
  }
  return resolve();
}).then(() => callback(null, "Done.")).catch((e => callback(e.message))));
