const Sqs = require('../../util/sqs');

const sqs = Sqs();

module.exports = (() => {
  const buffer = {};
  return {
    enqueue: (url, msg) => {
      if (!(url in buffer)) {
        buffer[url] = [];
      }
      buffer[url].push(msg);
    },
    flush: () => Promise.all(Object.entries(buffer).map(([queueUrl, msgs]) => sqs.sendBatch({
      queueUrl,
      messages: msgs.splice(0)
    })))
  };
})();
