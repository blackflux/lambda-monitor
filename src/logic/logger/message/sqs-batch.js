const sqs = require('../singleton/sqs');

module.exports = ({
  logGroup,
  logEvent,
  level
}) => {
  sqs.enqueue({
    logGroup,
    logEvent,
    level
  });
};
