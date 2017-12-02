const get = require("lodash.get");
const lambda = require("./util/lambda")({
  region: process.env.REGION
});

module.exports = (event, context, callback, rb) => lambda.getAllFunctions()
  .then(lambda.appendTags)
  .then(functions => functions.filter(f => get(f, "Tags.STAGE", null) === process.env.STAGE))
  .then((functions) => {
    const monitor = functions.find(f => get(f, "Tags.MONITOR", null) === "1");
    const monitored = functions.filter(f => get(f, "Tags.MONITORED", null) !== "0");
    return Promise.all(monitored.map(producer => lambda.subscribeCloudWatchLogGroup(monitor, producer)));
  })
  .then(() => callback(null, "Done."))
  .catch(callback);
