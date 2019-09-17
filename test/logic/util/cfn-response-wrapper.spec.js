/* eslint-disable no-console */
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const response = require('../../../src/logic/util/cfn-response-wrapper');

const sampleEvent = {
  RequestType: 'Create',
  ServiceToken: 'arn:aws:lambda:...:function:route53Dependency',
  ResponseURL: 'https://requestb.in/1b23n7c1',
  StackId: 'arn:aws:cloudformation:eu-west-1:...',
  RequestId: 'afd8d7c5-9376-4013-8b3b-307517b8719e',
  LogicalResourceId: 'Route53',
  ResourceType: 'Custom::Route53Dependency',
  ResourceProperties: {
    ServiceToken: 'arn:aws:lambda:...:function:route53Dependency',
    DomainName: 'example.com'
  }
};

const doTest = async (errObject, respObject, status, recorder) => {
  const [err, resp] = await new Promise((resolve) => response.wrap((event, context, callback, args) => {
    expect(args).to.equal('args');
    callback(errObject, respObject);
  })(sampleEvent, {}, (e, r) => resolve([e, r]), 'args'));
  expect(err).to.equal(errObject);
  expect(resp).to.equal(respObject);
  expect(recorder.get()).to.deep.equal([
    'Response body:\n',
    `{"Status":"${status.toUpperCase()}","Reason":"See the details in CloudWatch Log Stream: undefined",`
    + '"StackId":"arn:aws:cloudformation:eu-west-1:...","RequestId":"afd8d7c5-9376-4013-8b3b-307517b8719e",'
    + '"LogicalResourceId":"Route53","Data":{}}',
    'Status code: 200',
    'Status message: null'
  ]);
};

describe('Testing cfn-response-wrapper', { record: console, useNock: true }, () => {
  it('Testing Callback Execution Success', async ({ recorder }) => {
    await doTest(null, 'response', 'SUCCESS', recorder);
  });

  it('Testing Callback Execution Failure', async ({ recorder }) => {
    await doTest('err', undefined, 'FAILED', recorder);
  });
});
