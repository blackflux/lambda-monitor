import zlib from 'zlib';
import { logger } from 'lambda-monitor-logger';
import aws from './aws.js';

export const putGzipObject = (bucket, key, data) => aws.call('s3:PutObjectCommand', {
  ContentType: 'application/json',
  ContentEncoding: 'gzip',
  Bucket: bucket,
  Key: key,
  Body: zlib.gzipSync(data, { level: 9 })
});

export const emptyBucket = async (objParams) => {
  logger.info(`emptyBucket(): ${JSON.stringify(objParams)}`);
  const result = await aws.call('s3:ListObjectsV2Command', objParams);
  if (result.KeyCount === 0) {
    return;
  }
  const objectList = result.Contents.map((c) => ({ Key: c.Key }));
  logger.info(`Deleting ${objectList.length} items...`);
  const data = await aws.call('s3:DeleteObjectsCommand', {
    Bucket: objParams.Bucket,
    Delete: {
      Objects: objectList
    }
  });
  logger.info(`Deleted ${data.Deleted.length} items ok.`);
  if (result.IsTruncated) {
    await emptyBucket({
      Bucket: objParams.Bucket,
      ContinuationToken: result.NextContinuationToken
    });
  }
};
