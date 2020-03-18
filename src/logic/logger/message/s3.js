const s3PutGzipObject = require('../singleton/s3-put-gzip-object');

module.exports = (...args) => {
  s3PutGzipObject.enqueue(...args);
};
