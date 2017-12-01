const get = require("lodash.get");
const lambda = require("./util/lambda")({
  region: process.env.REGION
});

module.exports = (event, context, callback, rb) => {
  lambda.getAllFunctions().then(lambda.appendTags).then((functions) => {
    const stageFunctions = functions.filter(f => get(f, "Tags.STAGE", null) === process.env.STAGE);
    // console.log(stageFunctions);
    callback(null, "Done.");
  });
};
