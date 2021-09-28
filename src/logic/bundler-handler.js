const Datadog = require('./util/datadog');

module.exports = async (event, context) => {
  const datadog = Datadog();
  if (datadog === null) {
    return;
  }
  const lines = event.Records.map(({ body }) => JSON.parse(body));
  await datadog.Logger.uploadJsonArray(lines);
};
