import { putGzipObject } from '../../util/s3.js';

export default (() => {
  const queue = [];
  return {
    enqueue: (...args) => {
      queue.push(args);
    },
    flush: () => Promise.all(queue.splice(0).map((args) => putGzipObject(...args)))
  };
})();
