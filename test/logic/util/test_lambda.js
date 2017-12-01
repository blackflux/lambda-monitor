const path = require("path");
const expect = require("chai").expect;
const nockBack = require('nock').back;
const lambdaInvalid = require("../../../lib/logic/util/lambda")({
  region: "us-east-1",
  accessKeyId: "INVALID_ACCESS_KEY_ID",
  secretAccessKey: "INVALID_SECRET_ACCESS_KEY"
});
const lambda = require("../../../lib/logic/util/lambda")({
  region: "us-east-1"
});

nockBack.setMode('record');

describe("Testing Lambda", () => {
  it("Testing getAllFunctions Error", (done) => {
    nockBack.fixtures = path.join(__dirname, "__cassette");
    nockBack(`lambda-get-all-functions-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.getAllFunctions().catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing appendTags Error", (done) => {
    nockBack.fixtures = path.join(__dirname, "__cassette");
    nockBack(`lambda-get-append-tags-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.appendTags([{FunctionArn: "FUNCTION_ARN"}]).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing setCloudWatchRetention Error", (done) => {
    nockBack.fixtures = path.join(__dirname, "__cassette");
    nockBack(`lambda-get-set-cloud-watch-retention-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.setCloudWatchRetention({FunctionName: "FUNCTION_NAME"}).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing getAllFunctions Batched", (done) => {
    nockBack.fixtures = path.join(__dirname, "__cassette");
    nockBack(`lambda-get-all-functions.json_recording.json`, {}, (nockDone) => {
      lambda.getAllFunctions().then((r) => {
        expect(r.length).to.equal(2);
        nockDone();
        done();
      });
    });
  });
});
