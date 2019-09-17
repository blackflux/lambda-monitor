const get = require('lodash.get');
const cfnResponse = require('./util/cfn-response-wrapper');
const s3 = require('./util/s3');
const rb = require('./util/rollbar');

module.exports = cfnResponse.wrap((event, context, callback) => new Promise((resolve, reject) => {
  const requestType = get(event, 'RequestType');
  if (requestType === 'Delete') {
    const Bucket = get(event, 'ResourceProperties.BucketName');
    if (Bucket === undefined) {
      return reject(new Error('No Bucket Provided.'));
    }
    return s3.emptyBucket({ Bucket })
      .then(() => rb({ level: 'info', message: `${Bucket} emptied!` }))
      .then(resolve)
      .catch(reject);
  }
  return resolve();
}).then(() => callback(null, 'Done.')).catch(callback));
