import get from 'lodash.get';
import { logger } from 'lambda-monitor-logger';
import { emptyBucket } from './util/s3.js';

export default async (event) => {
  const requestType = get(event, 'RequestType');
  if (requestType === 'Delete') {
    const Bucket = get(event, 'ResourceProperties.BucketName');
    if (Bucket === undefined) {
      throw new Error('No Bucket Provided.');
    }
    await emptyBucket({ Bucket });
    logger.info(`${Bucket} emptied!`);
  }
};
