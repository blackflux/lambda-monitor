const path = require("path");
const expect = require("chai").expect;
const nockBack = require('nock').back;
const lambdaInvalid = require("../../../src/logic/util/lambda")({
  region: "us-east-1",
  accessKeyId: "INVALID_ACCESS_KEY_ID",
  secretAccessKey: "INVALID_SECRET_ACCESS_KEY"
});
const lambda = require("../../../src/logic/util/lambda")({
  region: "us-east-1"
});

const func = { FunctionARN: "FUNCTION_ARN", FunctionName: "FUNCTION_NAME" };

describe("Testing Lambda", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
    process.env.AWS_ACCESS_KEY_ID = "DUMMY";
    process.env.AWS_SECRET_ACCESS_KEY = "DUMMY";
  });

  after(() => {
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });

  it("Testing getAllFunctions Error", (done) => {
    nockBack(`lambda-get-all-functions-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.getAllFunctions().catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing setCloudWatchRetention Error", (done) => {
    nockBack(`lambda-get-set-cloud-watch-retention-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.setCloudWatchRetention(func, 30).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing subscribeCloudWatchLogGroup Error", (done) => {
    nockBack(`lambda-subscribe-cloud-watch-log-group-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.subscribeCloudWatchLogGroup(func, func).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing appendLogRetentionInfo Error", (done) => {
    nockBack(`lambda-append-log-retention-info-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.appendLogRetentionInfo([func]).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing appendLogSubscriptionInfo Error", (done) => {
    nockBack(`lambda-append-log-subscription-info-error.json_recording.json`, {}, (nockDone) => {
      lambdaInvalid.appendLogSubscriptionInfo([func]).catch((e) => {
        expect(e.message).to.equal("The security token included in the request is invalid.");
        nockDone();
        done();
      });
    });
  });

  it("Testing getAllFunctions Batched", (done) => {
    nockBack(`lambda-get-all-functions-batched.json_recording.json`, {}, (nockDone) => {
      lambda.getAllFunctions({
        ResourcesPerPage: 1
      }).then((r) => {
        expect(r.length).to.equal(2);
        nockDone();
        done();
      }).catch(done.fail);
    });
  });
});
