import sqs from '../singleton/sqs.js';

export default ({
  logGroup,
  logEvent,
  level
}) => {
  if (process.env.DATADOG_API_KEY === undefined) {
    return;
  }
  try {
    const result = {
      _id: logEvent.id,
      _timestamp: logEvent.timestamp,
      _level: level,
      _group: logGroup,
      ...JSON.parse(logEvent.message)
    };
    sqs.enqueue(process.env.BUNDLER_QUEUE_URL, result);
  } catch (e) { /* ignored */ }
};
