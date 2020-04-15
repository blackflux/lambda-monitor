const path = require('path');
const fs = require('smart-fs');
const { Pool } = require('promise-pool-ext');

const singletons = fs
  .walkDir(path.join(__dirname, 'singleton'))
  .reduce((p, f) => Object.assign(p, {
    [f.slice(0, -3)]: fs.smartRead(path.join(__dirname, 'singleton', f))
  }), {});

module.exports.flushAll = async (context) => {
  const pool = Pool({
    concurrency: 10,
    timeout: Math.floor((context.getRemainingTimeInMillis() - 5000.0) / 1000.0) * 1000
  });
  try {
    await pool(Object.values(singletons).map((s) => () => s.flush()));
    return true;
  } catch (errors) {
    throw errors.find((e) => e instanceof Error);
  }
};
