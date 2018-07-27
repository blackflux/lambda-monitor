const expect = require("chai").expect;
const processLogs = require("../../src/logic/process-logs");

describe("Testing process-logs", () => {
  it("Testing Log Level Extraction", (done) => {
    const logs = [];
    processLogs({
      awslogs: {
        data: (
          "H4sIAHp0J1oA/zWQzW7bMBCEX0UgerQiLv+W0k1AnaBAmx6sUxOjWFErQ6gtGqJsowjy7mGa5sidGX6YeREnTokO3P09s2jE17Zrf//Y7n"
          + "btw1ZsRLzNvOQzeu1UDeBMjfl8jIeHJV7OWanolqojnfqBqjMfyhSP0zrRwuXA1zJeeblOfPvI7NaF6ZRDSgJWAJXS1dOX72233XV7dl6O"
          + "rFVwPRkf2AdNGpGUDYPxnvMX6dKnsEzndYrz/XRceUmieRKPceaPp9j/42yvPK/v0ouYhozTGqU1iAZ0jTLDrXZWSovWOYe1QilR6loZbR"
          + "CsAUDna21cRq5T3melU64KFsBI67F2zm4+d/vfpgQole6kaiw2tr7Lll8FBEU4ai7DOFJ2MJZE2JeDDoOVI8rQy+Lb4/3Ppugo/SneYUMR"
          + "L2tBY25TwJ2UReIQ5yE9z8+zeN2/vgGRLcfOsQEAAA=="
        )
      }
    }, {
      getRemainingTimeInMillis: () => 30000
    }, (err) => {
      expect(logs).to.deep.equal(["INFO: Task timed out after 1.00 seconds\n\n"]);
      expect(err).to.equal(null);
      done();
    }, { info: msg => logs.push(msg.message) });
  });
});
