import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { authorize, getToken } from '../src/lib/authentication';

// Internal dependencies for stubbing
import url from 'url';

describe('Authentication', () => {

  describe('#authorize', () => {
    beforeEach(() => {
      global.history = { replaceState: (state, title, uri) => {} };
    });
    afterEach(() => {
      url.parse.restore();
    });

    it('succeeds when auth_token param exists', () => {
      stub(url, 'parse', str => ({ query: { auth_token: 'secret'} }));
      expect(authorize()).to.equal(true);
    });

    it('fails when auth_token is missing', () => {
      stub(url, 'parse', str => ({ query: {} }));
      expect(authorize()).to.equal(false);
    });

    it('removes auth_token param from URL without modifying history', () => {
      var location = { host: 'foo.bar/', query: { auth_token: 'secret'} };
      stub(url, 'parse', str => (location));
      var state = spy();
      stub(global.history, 'replaceState', state);
      authorize();
      expect(state.firstCall.args).to.deep.equal([{}, '', '//foo.bar/']);
    });
  });
});
