const Aws = require('aws-sdk-wrap');

module.exports = (options) => {
  const aws = Aws({ config: options });

  return {
    sendBatch: (...args) => aws.sqs.sendMessageBatch(...args)
  };
};
