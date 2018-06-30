const expect = require("chai").expect;
const timeoutPromise = require("../../../src/logic/util/timeout-promise");

describe("Testing timeout-promise", () => {
  it("Testing Timeout", (done) => {
    timeoutPromise(new Promise((resolve, reject) => {}), 1, 'name').catch((err) => {
      expect(err.message).to.equal("Promise \"name\" timed out after 1 ms");
      done();
    });
  });
});
