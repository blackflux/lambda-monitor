import request from 'request-promise-native';

export default (() => {
  const queue = [];
  return {
    enqueue: (...args) => {
      queue.push(args);
    },
    flush: () => Promise.all(queue.splice(0).map((args) => request(...args)))
  };
})();
