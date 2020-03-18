const path = require('path');
const fs = require('smart-fs');

const timeoutPromise = require('../util/timeout-promise');
const promiseComplete = require('../util/promise-complete');

const singletons = fs
  .walkDir(path.join(__dirname, 'singleton'))
  .reduce((p, f) => Object.assign(p, {
    [f.slice(0, -3)]: fs.smartRead(path.join(__dirname, 'singleton', f))
  }), {});

module.exports.flushAll = (context) => {
  const timeout = Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000;
  return promiseComplete(Object.entries(singletons)
    .map(([name, s]) => timeoutPromise(s.flush(), timeout, name)));
};
