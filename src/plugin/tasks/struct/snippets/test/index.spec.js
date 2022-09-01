import { expect } from 'chai';
import * as index from '../src/index.js';

describe('Testing index.js', () => {
  it('Testing Exports', () => {
    expect(Object.keys(index)).to.deep.equal([
      'batcherHandler',
      'bundlerHandler',
      'emptyBucket',
      'processLogs',
      'subscribe'
    ]);
  });
});
