import { expect } from 'chai';
import index from '../src/index.js';

describe('Testing index.js', () => {
  it('Testing Exports', () => {
    expect(Object.keys(index)).to.deep.equal([
      'batcherHandler',
      'bundlerHandler',
      'processLogs',
      'subscribe',
      'emptyBucket'
    ]);
  });
});
