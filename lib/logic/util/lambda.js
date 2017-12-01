const AWS = require("aws-sdk");

module.exports = (options) => {
  const lambda = new AWS.Lambda(options);

  const getAllFunctions = (marker = null) => new Promise((resolve, reject) => lambda
    .listFunctions({ Marker: marker }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return data.NextMarker === null ? resolve(data.Functions) : getAllFunctions(data.NextMarker)
        .then(functions => resolve(functions.concat(data.Functions)))
        .catch(reject)
    }));

  return {
    getAllFunctions
  };
};
