const get = require("lodash.get");
const lambda = require("./util/lambda")({
  region: process.env.REGION
});
const cfnResponse = require("./util/cfn-response-wrapper");

module.exports = cfnResponse.wrap((event, context, callback, rb) => lambda.getAllFunctions()
  .then(lambda.appendTags)
  .then(functions => functions.filter(f => get(f, "Tags.STAGE", null) === process.env.STAGE))
  .then(functions => Promise
    .all(functions.map(f => lambda.setCloudWatchRetention(f)))
    .then(() => callback(null, "Done."))
    .catch(callback)));
