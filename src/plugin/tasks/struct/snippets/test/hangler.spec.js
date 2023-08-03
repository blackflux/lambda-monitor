import { expect } from 'chai';
import * as hangler from '../src/hangler.js';

describe('Testing hangler.js', () => {
  it('Testing Exports', () => {
    expect(Object.keys(hangler)).to.deep.equal([
      'batcherHandler',
      'bundlerHandler',
      'emptyBucket',
      'processLogs',
      'subscribe'
    ]);
  });
});
