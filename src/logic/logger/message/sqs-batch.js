const sqs = require('../singleton/sqs');

module.exports = ({
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
