const path = require('path');
const fs = require('smart-fs');

const singletons = fs
  .walkDir(path.join(__dirname, 'singleton'))
  .reduce((p, f) => Object.assign(p, {
    [f.slice(0, -3)]: fs.smartRead(path.join(__dirname, 'singleton', f))
  }), {});

module.exports.flushAll = () => Promise.all(Object.values(singletons).map((s) => s.flush()));
