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

const doTest = async (errObject, respObject, status, getConsoleOutput) => {
  const [err, resp] = await new Promise((resolve) => response.wrap((event, context, callback, rb) => {
    expect(rb).to.equal('rb');
    callback(errObject, respObject);
  })(sampleEvent, {}, (e, r) => resolve([e, r]), 'rb'));
  expect(err).to.equal(errObject);
  expect(resp).to.equal(respObject);
  expect(getConsoleOutput()).to.deep.equal([
    'Response body:\n',
    `{"Status":"${status.toUpperCase()}","Reason":"See the details in CloudWatch Log Stream: undefined",`
    + '"StackId":"arn:aws:cloudformation:eu-west-1:...","RequestId":"afd8d7c5-9376-4013-8b3b-307517b8719e",'
    + '"LogicalResourceId":"Route53","Data":{}}',
    'Status code: 200',
    'Status message: null'
  ]);
};

describe('Testing cfn-response-wrapper', { recordConsole: true, useNock: true }, () => {
  it('Testing Callback Execution Success', async ({ getConsoleOutput }) => {
    await doTest(null, 'response', 'SUCCESS', getConsoleOutput);
  });

  it('Testing Callback Execution Failure', async ({ getConsoleOutput }) => {
    await doTest('err', undefined, 'FAILED', getConsoleOutput);
  });
});
