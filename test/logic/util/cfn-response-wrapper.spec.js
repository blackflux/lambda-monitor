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

const logs = [];
const consoleLogOriginal = console.log;

const doTest = (errObject, respObject, status) => {
  response.wrap((event, context, callback, rb) => {
    expect(rb).to.equal('rb');
    callback(errObject, respObject);
  })(sampleEvent, {}, (err, resp) => {
    expect(err).to.equal(errObject);
    expect(resp).to.equal(respObject);
    expect(logs).to.deep.equal([
      'Response body:\n',
      `{"Status":"${status.toUpperCase()}","Reason":"See the details in CloudWatch Log Stream: undefined",`
      + '"StackId":"arn:aws:cloudformation:eu-west-1:...","RequestId":"afd8d7c5-9376-4013-8b3b-307517b8719e",'
      + '"LogicalResourceId":"Route53","Data":{}}',
      'Status code: 200',
      'Status message: null'
    ]);
  }, 'rb');
};

describe('Testing cfn-response-wrapper', { useNock: true }, () => {
  before(() => {
    console.log = (...args) => {
      logs.push(...args);
    };
  });
  after(() => {
    console.log = consoleLogOriginal;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing Callback Execution Success', () => {
    doTest(null, 'response', 'SUCCESS');
  });

  it('Testing Callback Execution Failure', () => {
    doTest('err', undefined, 'FAILED');
  });
});
