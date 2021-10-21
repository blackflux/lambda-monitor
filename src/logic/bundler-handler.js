const objectScan = require('object-scan');
const Datadog = require('./util/datadog');

module.exports = async (event, context) => {
  const datadog = Datadog();
  if (datadog === null) {
    return;
  }
  const arr = event.Records.map(({ body }) => JSON.parse(body));
  objectScan(['[*]**'], {
    filterFn: ({ parent, property, value }) => {
      if (value instanceof Object && Object.keys(value).length === 0) {
        // eslint-disable-next-line no-param-reassign
        parent[property] = `<empty ${JSON.stringify(value)}>`;
      }
    }
  })(arr);
  await datadog.Logger.uploadJsonArray(arr);
};
