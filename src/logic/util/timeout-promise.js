module.exports = (promise, ms, name) => new Promise((resolve, reject) => {
  // we need to use clearTimeout since we freeze time in some of our tests
  const timer = setTimeout(() => reject(new Error(`Promise "${name}" timed out after ${ms} ms`)), ms);
  promise.then((value) => {
    clearTimeout(timer);
    resolve(value);
  }).catch((err) => {
    clearTimeout(timer);
    reject(err);
  });
});
