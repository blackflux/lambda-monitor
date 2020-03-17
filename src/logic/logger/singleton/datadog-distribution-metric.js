const Datadog = require('datadog-light');

module.exports = (() => {
  const datadog = process.env.DATADOG_API_KEY === undefined
    ? null
    : Datadog(process.env.DATADOG_API_KEY);

  return {
    enqueue: (...args) => {
      if (datadog !== null) {
        datadog.DistributionMetric.enqueue(...args);
      }
    },
    flush: () => {
      if (datadog !== null) {
        return datadog.DistributionMetric.flush();
      }
      return Promise.resolve(true);
    }
  };
})();
