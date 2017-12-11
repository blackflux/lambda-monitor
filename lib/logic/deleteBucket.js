const get = require("lodash.get");
const cfnResponse = require("./util/cfn-response-wrapper");
const s3 = require("./util/s3");

module.exports = cfnResponse.wrap((event, context, callback, rb) => new Promise((resolve, reject) => {
  const requestType = get(event, 'RequestType');
  if (requestType === 'Delete') {
    const bucketName = get(event, "ResourceProperties.BucketName");
    if (bucketName === undefined) {
      return reject(new Error("No Bucket Provided."));
    }
    return s3.emptyBucket({ Bucket: bucketName }, rb)
      .then(() => s3.deleteBucket(bucketName, rb))
      .then(resolve).catch(reject);
  }
  return resolve();
}).then(() => callback(null, "Done.")).catch((e => callback(e.message))));
