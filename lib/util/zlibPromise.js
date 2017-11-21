const zlib = require('zlib');

module.exports = {
  gunzip: data => new Promise((resolve, reject) => {
    zlib.gunzip(data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })
};
