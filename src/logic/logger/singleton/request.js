const request = require('request-promise-native');

module.exports = (() => {
  const queue = [];
  return {
    enqueue: (...args) => {
      queue.push(args);
    },
    flush: () => Promise.all(queue.splice(0).map((args) => request(...args)))
  };
})();
