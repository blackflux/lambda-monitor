import sqs from '../singleton/sqs.js';

export default ({
  logGroup,
  logEvent,
  level
}) => {
  sqs.enqueue(process.env.BATCHER_QUEUE_URL, {
    logGroup,
    logEvent,
    level
  });
};
