import { test } from 'sinon';
import { expect } from 'chai';

import location from '../../src/lib/location';

// Internal dependencies to compare
import URL from 'url-parse';

describe('Location', () => {

  before(function() {
    if (!global.location) { global.location = { href: 'http://ti.test/' }; }
    if (!global.history)  { global.history  = { replaceState() {} }; }
  });

  describe('#parse', () => {
    it('parses the URL', test(function() {
      const result = location.parse();
      expect(result instanceof URL).to.be.true;
    }));
  });

  describe('#replace', () => {
    it('changes URL without modifying history', test(function() {
      const target = 'safe://foo.bar';
      this.mock(global.history).expects('replaceState')
                               .withExactArgs({}, '', target);
      location.replace(target);
    }));
  });
});

