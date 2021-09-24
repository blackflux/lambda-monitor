const Sqs = require('../../util/sqs');

const sqs = Sqs();

module.exports = (() => {
  const queue = [];
  return {
    enqueue: (msg) => {
      queue.push(msg);
    },
    flush: () => sqs.sendBatch({
      messages: queue.splice(0),
      queueUrl: process.env.BATCHER_QUEUE_URL
    })
  };
})();
