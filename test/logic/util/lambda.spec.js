const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Lambda = require('../../../src/logic/util/lambda');

const func = { FunctionARN: 'FUNCTION_ARN', FunctionName: 'FUNCTION_NAME' };

describe('Testing Lambda', { useNock: true }, () => {
  let lambdaInvalid;
  let lambda;
  before(() => {
    lambdaInvalid = Lambda({
      accessKeyId: 'INVALID_ACCESS_KEY_ID',
      secretAccessKey: 'INVALID_SECRET_ACCESS_KEY'
    });
    lambda = Lambda();
  });
  it('Testing getAllFunctions Error', async ({ capture }) => {
    const e = await capture(() => lambdaInvalid.getAllFunctions());
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing setCloudWatchRetention Error', async ({ capture }) => {
    const e = await capture(() => lambdaInvalid.setCloudWatchRetention(func, 30));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing subscribeCloudWatchLogGroup Error', async ({ capture }) => {
    const e = await capture(() => lambdaInvalid.subscribeCloudWatchLogGroup(func, func));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing appendLogGroupInfo Error', async ({ capture }) => {
    const e = await capture(() => lambdaInvalid.appendLogGroupInfo([func]));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing appendLogSubscriptionInfo Error', async ({ capture }) => {
    const e = await capture(() => lambdaInvalid.appendLogSubscriptionInfo([func]));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing getAllFunctions Batched', async () => {
    const result = await lambda.getAllFunctions();
    expect(result.length).to.equal(2);
  });
});
