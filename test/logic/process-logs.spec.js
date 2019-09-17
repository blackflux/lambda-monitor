// /* eslint-disable no-console */
// const assert = require('assert');
// const zlib = require('zlib');
// const expect = require('chai').expect;
// const { describe } = require('node-tdd');
// const processLogs = require('../../src/logic/process-logs');
//
// describe('Testing process-logs', { useNock: true }, () => {
//   const logs = [];
//   let consoleLogOriginal;
//   beforeEach(() => {
//     consoleLogOriginal = console.log;
//     console.log = (message) => {
//       logs.push(message);
//     };
//     assert(process.env.VERBOSE === undefined);
//     process.env.VERBOSE = '1';
//   });
//
//   afterEach(() => {
//     console.log = consoleLogOriginal;
//     delete process.env.VERBOSE;
//   });
//
//   // it('Testing Log Level Extraction', async ({ fixture }) => {
//   //   await new Promise((resolve) => processLogs({
//   //     awslogs: {
//   //       data: zlib.gzipSync(JSON.stringify(fixture('data')), { level: 9 })
//   //     }
//   //   }, {
//   //     getRemainingTimeInMillis: () => 30000
//   //   }, (err) => {
//   //     expect(err, JSON.stringify(err)).to.equal(null);
//   //     expect(logs).to.deep.equal(['INFO: Task timed out after 1.00 seconds\n\n']);
//   //     resolve();
//   //   }));
//   // });
// });
