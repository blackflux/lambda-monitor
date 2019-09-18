const get = require('lodash.get');
const { logger } = require('lambda-monitor-logger');
const cfnResponse = require('./util/cfn-response-wrapper');
const s3 = require('./util/s3');

const emptyBucket = async (event) => {
  const requestType = get(event, 'RequestType');
  if (requestType === 'Delete') {
    const Bucket = get(event, 'ResourceProperties.BucketName');
    if (Bucket === undefined) {
      throw new Error('No Bucket Provided.');
    }
    await s3.emptyBucket({ Bucket });
    logger.info(`${Bucket} emptied!`);
  }
};

module.exports = cfnResponse.wrap((event, context, callback) => emptyBucket(event)
  .then(() => callback(null, 'Done.'))
  .catch(callback));
