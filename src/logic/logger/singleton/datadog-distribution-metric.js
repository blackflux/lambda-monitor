import Datadog from '../../util/datadog.js';

export default (() => {
  const datadog = Datadog();

  return {
    enqueue: (metric, datapoints, opts = {}) => {
      if (datadog !== null) {
        if (opts.tags === undefined) {
          // eslint-disable-next-line no-param-reassign
          opts.tags = [];
        }
        opts.tags.push(`environment:${process.env.ENVIRONMENT}`);
        datadog.DistributionMetric.enqueue(metric, datapoints, opts);
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
