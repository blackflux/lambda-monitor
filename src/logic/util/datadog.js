import Datadog from 'datadog-light';

export default () => (process.env.DATADOG_API_KEY === undefined ? null : Datadog(process.env.DATADOG_API_KEY));
