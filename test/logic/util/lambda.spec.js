import { describe } from 'node-tdd';
import { expect } from 'chai';
import Lambda from '../../../src/logic/util/lambda.js';

const func = { FunctionARN: 'FUNCTION_ARN', FunctionName: 'FUNCTION_NAME' };

describe('Testing Lambda', { useNock: true }, () => {
  let lambda;

  before(() => {
    lambda = Lambda();
  });

  it('Testing getAllFunctions Error', async ({ capture }) => {
    const e = await capture(() => lambda.getAllFunctions());
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing subscribeCloudWatchLogGroup Error', async ({ capture }) => {
    const e = await capture(() => lambda.subscribeCloudWatchLogGroup(func, func));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing appendLogSubscriptionInfo Error', async ({ capture }) => {
    const e = await capture(() => lambda.appendLogSubscriptionInfo([func]));
    expect(e.message).to.equal('The security token included in the request is invalid.');
  });

  it('Testing getAllFunctions Batched', async () => {
    const result = await lambda.getAllFunctions();
    expect(result.length).to.equal(2);
  });

  it('Testing getFunctionConfiguration', async () => {
    const result = await lambda.getFunctionConfiguration('lambda-function-name');
    expect(result.Timeout).to.equal(20);
    expect(result.CodeSize).to.equal(16163282);
  });
});
