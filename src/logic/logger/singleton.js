import { Pool } from 'promise-pool-ext';
import datadogDistributionMetric from './singleton/datadog-distribution-metric.js';
import request from './singleton/request.js';
import s3PutGzipObject from './singleton/s3-put-gzip-object.js';
import sqs from './singleton/sqs.js';

const singletons = {
  'datadog-distribution-metric': datadogDistributionMetric,
  request,
  's3-put-gzip-object': s3PutGzipObject,
  sqs
};

export const flushAll = async (context) => {
  const pool = Pool({
    concurrency: 10,
    timeout: Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000
  });
  try {
    await pool(Object.values(singletons).map((s) => () => s.flush()));
    return true;
  } catch (errors) {
    throw errors.find((e) => e instanceof Error);
  }
};
