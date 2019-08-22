const expect = require('chai').expect;
const { describe } = require('node-tdd');
const lambdaInvalid = require('../../../src/logic/util/lambda')({
  region: 'us-east-1',
  accessKeyId: 'INVALID_ACCESS_KEY_ID',
  secretAccessKey: 'INVALID_SECRET_ACCESS_KEY'
});
const lambda = require('../../../src/logic/util/lambda')({
  region: 'us-east-1'
});

const func = { FunctionARN: 'FUNCTION_ARN', FunctionName: 'FUNCTION_NAME' };

describe('Testing Lambda', { useNock: true }, () => {
  it('Testing getAllFunctions Error', async () => {
    try {
      await lambdaInvalid.getAllFunctions();
    } catch (e) {
      expect(e.message).to.equal('The security token included in the request is invalid.');
    }
  });

  it('Testing setCloudWatchRetention Error', async () => {
    try {
      await lambdaInvalid.setCloudWatchRetention(func, 30);
    } catch (e) {
      expect(e.message).to.equal('The security token included in the request is invalid.');
    }
  });

  it('Testing subscribeCloudWatchLogGroup Error', async () => {
    try {
      await lambdaInvalid.subscribeCloudWatchLogGroup(func, func);
    } catch (e) {
      expect(e.message).to.equal('The security token included in the request is invalid.');
    }
  });

  it('Testing appendLogRetentionInfo Error', async () => {
    try {
      await lambdaInvalid.appendLogRetentionInfo([func]);
    } catch (e) {
      expect(e.message).to.equal('The security token included in the request is invalid.');
    }
  });

  it('Testing appendLogSubscriptionInfo Error', async () => {
    try {
      await lambdaInvalid.appendLogSubscriptionInfo([func]);
    } catch (e) {
      expect(e.message).to.equal('The security token included in the request is invalid.');
    }
  });

  it('Testing getAllFunctions Batched', async () => {
    const result = await lambda.getAllFunctions({ ResourcesPerPage: 1 });
    expect(result.length).to.equal(2);
  });
});
