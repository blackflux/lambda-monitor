const lambda = require("./util/lambda")({
  region: process.env.REGION
});
const cfnResponse = require("./util/cfn-response-wrapper");

module.exports = cfnResponse.wrap((event, context, callback, rb) => lambda
  .getAllFunctions({
    TagFilters: [{
      Key: "STAGE",
      Values: [process.env.STAGE]
    }]
  })
  .then(functions => Promise
    .all(functions.map(f => lambda.setCloudWatchRetention(f)))
    .then(() => callback(null, "Done."))
    .catch(callback)));
