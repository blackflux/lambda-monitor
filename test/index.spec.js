import path from 'path';
import roboConfig from 'robo-config';
import fs from 'smart-fs';
import { expect } from 'chai';
import plugin from '../src/index.js';

const { load } = roboConfig;

describe('Testing Plugin', () => {
  it('Documenting Plugin Tasks', () => {
    expect(load(plugin).syncDocs()).to.deep.equal([]);
  });

  it('Testing Plugin Tasks', () => {
    expect(load(plugin).test(path.join(fs.dirname(import.meta.url), 'projects'))).to.deep.equal({
      'assorted/@default': []
    });
  });
});
