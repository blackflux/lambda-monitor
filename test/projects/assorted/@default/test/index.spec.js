const { expect } = require('chai');
const index = require('../src/index');

describe('Testing index.js', () => {
  it('Testing Exports', () => {
    expect(Object.keys(index)).to.deep.equal([
      'processLogs',
      'subscribe',
      'setRetention',
      'emptyBucket'
    ]);
  });
});
