import anyMeta from './message/any-meta.js';
import datadog from './message/datadog.js';
import email from './message/email.js';
import json from './message/json.js';
import rollbar from './message/rollbar.js';
import s3 from './message/s3.js';
import sqsBatch from './message/sqs-batch.js';

const messageLogger = {
  'any-meta': anyMeta,
  datadog,
  email,
  json,
  rollbar,
  s3,
  'sqs-batch': sqsBatch
};

export default (type, ...args) => {
  messageLogger[type](...args);
};
