import { expect } from 'chai';
import { test } from 'sinon';

import Authentication from '../../src/lib/authentication';

// Internal dependencies to stub
import location from '../../src/lib/location';

describe('Authentication', () => {
  before(function() {
    if (!global.location) {
      global.location = { href: 'http://ti.test/' };
    }
  });

  describe('#authorize', () => {
    it('succeeds when auth_token param exists', test(function() {
      this.stub(location, 'parse', str => ({ query: { auth_token: 'secret'} }));
      this.stub(location, 'replace');
      expect(Authentication.authorize()).to.equal(true);
    }));

    it('fails when auth_token is missing', test(function() {
      this.stub(location, 'parse', str => ({ query: {} }));
      expect(Authentication.authorize()).to.equal(false);
    }));

    it('removes auth_token param from URL without modifying history', test(function() {
      let url = { host: 'foo.bar/', query: { auth_token: 'secret'} };
      this.stub(location, 'parse').returns(url);
      this.mock(location).expects('replace')
                         .withExactArgs({ host: 'foo.bar/', query: {} });
      Authentication.authorize();
    }));
  });

  describe('#token', () => {
    it('is empty by default', test(function() {
      Authentication.authorize();
      expect(Authentication.token()).to.be.undefined
    }));

    it('stores successfully extracted auth token', test(function() {
      let url = { query: { auth_token: 'secret'} };
      this.stub(location, 'parse').returns(url);
      this.stub(location, 'replace');
      Authentication.authorize();
      expect(Authentication.token()).to.equal('secret');
    }));
  });
});
