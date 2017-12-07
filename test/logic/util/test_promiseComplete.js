const expect = require("chai").expect;
const promiseComplete = require("../../../lib/logic/util/promiseComplete");

describe("Testing promiseComplete", () => {
  it("Testing Multiple Errors", (done) => {
    const error1 = new Error("error1");
    const error2 = new Error("error2");
    promiseComplete([
      new Promise((resolve, reject) => reject(error1)),
      new Promise((resolve, reject) => reject(error2))
    ]).catch((e) => {
      expect(e instanceof Error).to.equal(true);
      expect(e.message).to.equal([error1.message, error2.message].join(", "));
      done();
    });
  });
});
