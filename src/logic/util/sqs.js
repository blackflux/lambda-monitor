import aws from './aws.js';

export default () => ({
  sendBatch: (...args) => aws.sqs.sendMessageBatch(...args)
});
