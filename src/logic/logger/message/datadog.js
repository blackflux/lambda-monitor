const get = require('lodash.get');
const Datadog = require('datadog-light');

module.exports = async (message) => {
  if (process.env.DATADOG_API_KEY === undefined) {
    return Promise.resolve();
  }
  const distributionMetric = Datadog(process.env.DATADOG_API_KEY).DistributionMetric;

  let parsedMessage = {};
  try {
    parsedMessage = JSON.parse(message);

    if (get(parsedMessage, ['type']) === 'distribution-metric') {
      distributionMetric.enqueue(...get(parsedMessage, ['args']));
    }
  } catch (e) {
    /* ignored */
  }

  return distributionMetric.flush();
};
