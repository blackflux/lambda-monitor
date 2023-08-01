import path from 'path';
import minimist from 'minimist';
import LambdaTdd from 'lambda-tdd';
import fs from 'smart-fs';

LambdaTdd({
  cwd: path.join(fs.dirname(import.meta.url), '..'),
  verbose: minimist(process.argv.slice(2)).verbose === true,
  timeout: minimist(process.argv.slice(2)).timeout,
  nockHeal: minimist(process.argv.slice(2))['nock-heal'],
  testHeal: minimist(process.argv.slice(2))['test-heal'],
  handlerFile: path.join(fs.dirname(import.meta.url), '..', 'src', 'handler.js'),
  cassetteFolder: path.join(fs.dirname(import.meta.url), 'lambda', '__cassettes'),
  envVarYml: path.join(fs.dirname(import.meta.url), 'lambda', 'env.yml'),
  envVarYmlRecording: path.join(fs.dirname(import.meta.url), 'lambda', 'env.recording.yml'),
  testFolder: path.join(fs.dirname(import.meta.url), 'lambda', 'tests')
}).execute();
