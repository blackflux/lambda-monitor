import get from 'lodash.get';
import datadogDistributionMetric from '../singleton/datadog-distribution-metric.js';

export default ({ message }) => {
  let parsedMessage = {};
  try {
    parsedMessage = JSON.parse(message);
  } catch { /* ignored */ }
  if (get(parsedMessage, ['type']) === 'distribution-metric') {
    datadogDistributionMetric.enqueue(...get(parsedMessage, ['args']));
  }
};
