const Datadog = require('datadog-light');

module.exports = () => (process.env.DATADOG_API_KEY === undefined ? null : Datadog(process.env.DATADOG_API_KEY));
