const get = require('lodash.get');
const datadogDistributionMetric = require('../singleton/datadog-distribution-metric');

module.exports = ({ message }) => {
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
