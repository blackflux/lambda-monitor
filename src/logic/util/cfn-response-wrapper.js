const response = require("cfn-response");
const defaults = require("lodash.defaults");
const difference = require("lodash.difference");

const resourceInitEventKeys = [
  "RequestType", "ServiceToken", "ResponseURL", "StackId", "RequestId",
  "LogicalResourceId", "ResourceType", "ResourceProperties"
];

module.exports.wrap = fn => (event, context, callback, ...args) => fn(event, context, (err, ...cbargs) => {
  if (difference(resourceInitEventKeys, Object.keys(event)).length === 0) {
    return response.send(event, defaults({
      done: () => callback(err, ...cbargs)
    }, context), err ? response.FAILED : response.SUCCESS, {});
  }
  return callback(err, ...cbargs);
}, ...args);
