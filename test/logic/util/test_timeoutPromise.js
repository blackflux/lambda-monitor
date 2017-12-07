const expect = require("chai").expect;
const timeoutPromise = require("../../../lib/logic/util/timeoutPromise");

describe("Testing timeoutPromise", () => {
  it("Testing Timeout", (done) => {
    timeoutPromise(new Promise((resolve, reject) => {}), 1, 'name').catch((err) => {
      expect(err.message).to.equal("Promise \"name\" timed out after 1 ms");
      done();
    });
  });
});
