const get = require('lodash.get');
const datadogDistributionMetric = require('../singleton/datadog-distribution-metric');

module.exports = ({
  logGroup, level, message, timestamp
}) => {
  let parsedMessage = {};
  try {
    parsedMessage = JSON.parse(message);
  } catch (e) {
    /* ignored */
  }
  if (get(parsedMessage, ['type']) === 'distribution-metric') {
    datadogDistributionMetric.enqueue(...get(parsedMessage, ['args']));
  }
};
