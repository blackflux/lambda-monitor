const cacheManager = require('cache-manager');
const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({
  region: process.env.REGION
});
const memoryCache = cacheManager.caching({
  store: 'memory',
  max: 500,
  ttl: 600
});

const logGroupRegex = /^\/aws\/lambda\/([^/]+)?$/g;

module.exports.getDetailsCached = logGroup => memoryCache
  .wrap(logGroup, new Promise((resolve, reject) => lambda
    .getFunction({ FunctionName: logGroupRegex.exec(logGroup)[1] }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    })));
