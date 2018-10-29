const path = require('path');
const optimist = require('optimist');
const yaml = require('yaml-boost');

module.exports = yaml.load(
  path.join(__dirname, 'serverless.core.yml'),
  optimist.argv,
);
