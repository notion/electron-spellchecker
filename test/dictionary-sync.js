import './support';

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import DictionarySync, { getURLForHunspellDictionary } from '../src/dictionary-sync';

const d = require('debug')('electron-spellchecker-test:dictionary-sync');

let testCount = 0;

describe('getURLForHunspellDictionary', () => {
  it('should grab url for english', () => {
    const url = getURLForHunspellDictionary('en_US');
    expect(url).to.equal('https://redirector.gvt1.com/edgedl/chrome/dict/en-us-7-1.bdic');
  });
});

describe('The Dictionary Sync class', function() {
  beforeEach(function() {
    this.tempCacheDir = path.join(__dirname, `__dict_sync_${testCount++}`);
    this.fixture = new DictionarySync(this.tempCacheDir);

    rimraf.sync(this.tempCacheDir);
  });

  afterEach(function() {
    rimraf.sync(this.tempCacheDir);
  });

  describe('loadDictionaryForLanguage method', function() {
    this.timeout(60*1000);

    it('should download the German dictionary', async function() {
      let buf = await this.fixture.loadDictionaryForLanguage('de-DE');

      expect(buf.constructor.name).to.equal('Buffer');
      expect(buf.length > 1000).to.be.ok;
    });

    it('should throw when we a language that isnt real', async function() {
      let ret = null;
      try {
        ret = await this.fixture.loadDictionaryForLanguage('zz-ZZ');
      } catch (e) {
        return;
      }

      d(ret);
      d(typeof ret);
      fs.writeFileSync('./wtfisthisfile', ret);
      throw new Error("Didn't fail!");
    });

    it('should throw when we try to load es-MX because Google doesnt have it', async function() {
      let ret = null;
      try {
        ret = await this.fixture.loadDictionaryForLanguage('es-MX');
      } catch (e) {
        return;
      }

      d(ret);
      d(typeof ret);
      fs.writeFileSync('./wtfisthisfile', ret);
      throw new Error("Didn't fail!");
    });
  });
});
