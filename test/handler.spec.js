const path = require("path");
const get = require("lodash.get");
const AWS = require("aws-sdk");
const lambdaTester = require("lambda-tdd")({
  cwd: path.join(__dirname, ".."),
  verbose: process.argv.slice(2).indexOf("--debug") !== -1,
  handlerFile: path.join(__dirname, "..", "src", "handler.js"),
  cassetteFolder: path.join(__dirname, "lambda", "__cassettes"),
  envVarYml: path.join(__dirname, "lambda", "env.yml"),
  testFolder: path.join(__dirname, "lambda", "tests")
});

// dummy credentials are required for mock since AWS raises "Missing credentials" if non are found
process.env.AWS_ACCESS_KEY_ID = get(AWS, 'config.credentials.accessKeyId', "DUMMY");
process.env.AWS_SECRET_ACCESS_KEY = get(AWS, 'config.credentials.secretAccessKey', "DUMMY");

lambdaTester.execute((process.argv.slice(2).find(e => e.startsWith("--filter=")) || "").substring(9));
