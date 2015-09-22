import { test } from 'sinon';

import location from '../../src/lib/location';

// Internal dependencies to stub
import url from 'url';

describe('Location', () => {

  before(function() {
    if (!global.location) { global.location = { href: 'http://ti.test/' }; }
    if (!global.history)  { global.history  = { replaceState() {} }; }
  });

  describe('#parse', () => {
    it('parses the URL', test(function() {
      this.mock(url).expects('parse')
                    .withExactArgs(global.location.href, true);
      location.parse();
    }));
  });

  describe('#replace', () => {
    it('changes URL without modifying history', test(function() {
      let target = { host: 'foo.bar' };
      this.mock(global.history).expects('replaceState')
                               .withExactArgs({}, '', '//foo.bar');
      location.replace(target);
    }));

    it('uses query object instead of search string when present', test(function() {
      let target = { search: '?foo=baz', query: { baz: "42" } };
      this.mock(url).expects('format')
                    .withExactArgs({ search: null, query: { baz: "42" } });
      location.replace(target);
    }));
  });
});

