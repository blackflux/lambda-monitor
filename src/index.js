import path from 'path';
import fs from 'smart-fs';
import * as handler from './handler.js';

export default ({
  name: 'lambda-monitor',
  taskDir: path.join(fs.dirname(import.meta.url), 'plugin', 'tasks'),
  reqDir: path.join(fs.dirname(import.meta.url), 'plugin', 'reqs'),
  varDir: path.join(fs.dirname(import.meta.url), 'plugin', 'vars'),
  targetDir: path.join(fs.dirname(import.meta.url), 'plugin', 'targets'),
  docDir: path.join(fs.dirname(import.meta.url), 'plugin', 'docs'),
  exports: handler
});
