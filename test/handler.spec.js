const path = require('path');
const minimist = require('minimist');
const LambdaTdd = require('lambda-tdd');

LambdaTdd({
  cwd: path.join(__dirname, '..'),
  verbose: minimist(process.argv.slice(2)).verbose === true,
  timeout: minimist(process.argv.slice(2)).timeout,
  nockHeal: minimist(process.argv.slice(2))['nock-heal'],
  handlerFile: path.join(__dirname, '..', 'src', 'handler.js'),
  cassetteFolder: path.join(__dirname, 'lambda', '__cassettes'),
  envVarYml: path.join(__dirname, 'lambda', 'env.yml'),
  envVarYmlRecording: path.join(__dirname, 'lambda', 'env.recording.yml'),
  testFolder: path.join(__dirname, 'lambda', 'tests')
}).execute();
