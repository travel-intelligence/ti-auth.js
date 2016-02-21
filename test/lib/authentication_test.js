import { expect } from 'chai';
import { test } from 'sinon';

import Authentication from '../../src/lib/authentication';

// Internal dependencies to stub
import location from '../../src/lib/location';
import TiAuth from '../../src/ti-auth';

describe('Authentication', () => {
  before(function() {
    if (!global.location) {
      global.location = { href: 'http://ti-module.test/' };
    }
    TiAuth.DASHBOARD_URL = 'https://portal.test';
  });

  describe('#authorize', () => {
    it('succeeds when auth_token param exists', test(function() {
      this.stub(location, 'parse', str => ({ query: { auth_token: 'secret' } }));
      this.stub(location, 'replace');
      expect(Authentication.authorize()).to.equal(true);
    }));

    it('fails when auth_token is missing', test(function() {
      this.stub(location, 'parse', str => ({ query: {} }));
      expect(Authentication.authorize()).to.equal(false);
    }));

    it('removes auth_token param from URL without modifying history', test(function() {
      const url = { hostname: 'foo.bar',
                    query: { auth_token: 'secret', foo: 'bar' } };
      this.stub(location, 'parse').returns(url);
      this.mock(location).expects('replace')
                         .withExactArgs({ hostname: 'foo.bar',
                                          query: { foo: 'bar' } });
      Authentication.authorize();
    }));
  });

  describe('#unauthorize', () => {
    it('resets token', test(function() {
      this.stub(location, 'parse').returns({ query: { auth_token: 'secret' } });
      this.stub(location, 'replace');
      this.stub(location, 'redirect');
      Authentication.authorize();
      Authentication.unauthorize();
      expect(Authentication.token()).to.be.undefined;
    }));

    it('redirects back to dashboard for remove authentication', test(function() {
      this.mock(location).expects('redirect')
                         .withExactArgs('https://portal.test/authorize');
      Authentication.unauthorize();
    }));
  });

  describe('#token', () => {
    it('is empty by default', test(function() {
      this.stub(location, 'parse').returns({ query: {} });
      Authentication.authorize();
      expect(Authentication.token()).to.be.undefined
    }));

    it('stores successfully extracted auth token', test(function() {
      const url = { query: { auth_token: 'secret'} };
      this.stub(location, 'parse').returns(url);
      this.stub(location, 'replace');
      Authentication.authorize();
      expect(Authentication.token()).to.equal('secret');
    }));
  });
});
