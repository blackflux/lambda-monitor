const path = require('path');
const handler = require('./handler');

module.exports = ({
  name: 'lambda-monitor',
  taskDir: path.join(__dirname, 'plugin', 'tasks'),
  reqDir: path.join(__dirname, 'plugin', 'reqs'),
  varDir: path.join(__dirname, 'plugin', 'vars'),
  targetDir: path.join(__dirname, 'plugin', 'targets'),
  docDir: path.join(__dirname, 'plugin', 'docs'),
  exports: handler
});
