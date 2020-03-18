const s3 = require('../../util/s3');

module.exports = (() => {
  const queue = [];
  return {
    enqueue: (...args) => {
      queue.push(args);
    },
    flush: () => Promise.all(queue.splice(0).map((args) => s3.putGzipObject(...args)))
  };
})();
