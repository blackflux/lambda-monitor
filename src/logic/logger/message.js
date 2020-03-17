const path = require('path');
const fs = require('smart-fs');

const messageLogger = fs
  .walkDir(path.join(__dirname, 'message'))
  .reduce((p, f) => Object.assign(p, {
    [f.slice(0, -3)]: fs.smartRead(path.join(__dirname, 'message', f))
  }), {});

module.exports = (type, ...args) => {
  messageLogger[type](...args);
  return Promise.resolve();
};
