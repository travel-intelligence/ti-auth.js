import { expect } from 'chai';
import { test, spy, assert } from 'sinon';

import TiAuth from '../src/ti-auth';

// Internal dependencies to stub
import Authentication from '../src/lib/authentication';
import API from '../src/lib/api';
import Location from '../src/lib/location';

describe('TiAuth', () => {
  beforeEach(function() {
    if (!global.location) {
      global.location = { href: 'http://ti-module.test/' };
    }
    TiAuth.API_URL = 'https://api.test';
    TiAuth.DASHBOARD_URL = 'https://api.test';
  });

  describe('#initialize', () => {
   it('throws if API_URL has not been configured', test(function() {
     TiAuth.API_URL = '';
     TiAuth.DASHBOARD_URL = 'https://dashboard.test';
     expect(TiAuth.initialize).to.throw(Error);
    ;
   }));

   it('throws if DASHBOARD_URL has not been configured', test(function() {
     TiAuth.API_URL = 'https://api.test';
     TiAuth.DASHBOARD_URL = '';
     expect(TiAuth.initialize).to.throw(Error);
   }));

   it('attempts to authorize the user', test(function() {
     this.stub(Authentication, 'authorize', () => true);
     this.stub(API, 'get');
     TiAuth.initialize(function() {});
   }));

    it('unauthorizes if authorization failed', test(function() {
      this.stub(Authentication, 'authorize', false);
      var stub = spy();
      this.stub(Authentication, 'unauthorize', stub);
      TiAuth.initialize(function() {});
      assert.calledOnce(stub);
    }));

    it('loads user from API', test(function() {
      this.stub(Authentication, 'authorize', () => true);
      this.mock(API).expects('get').withArgs('https://api.test/api/v1/users/me');
      TiAuth.initialize(function() {});
    }));

    it('unauthorizes if request to API failed', test(function() {
      this.stub(Authentication, 'authorize', () => true);
      this.stub(API, 'get', function(url, success, error) {
        error('Nope.');
      });
      var stub = spy();
      this.stub(Authentication, 'unauthorize', stub);
      TiAuth.initialize(function() {});
      assert.calledOnce(stub);
    }));

    it('resolves with token and user object on success', test(function() {
      var user = { name: 'Joschka' };
      this.stub(Authentication, 'authorize', () => true);
      this.stub(Authentication, 'token', () => 'secret');
      this.stub(API, 'get', function(url, success, error) {
        success(user);
      });
      TiAuth.initialize(function() {
        expect(arguments[0]).to.equal('secret');
        expect(arguments[1]).to.equal(user);
      });
    }));
  });

  describe('#reauthorize', () => {
    it('delegates to Authentication#unauthorize', test(function() {
      var stub = spy();
      this.stub(Authentication, 'unauthorize', stub);
      TiAuth.reauthorize();
      assert.calledOnce(stub);
    }));
  });

  describe('#signout', () => {
    it('redirects to Dashboard/unauthorize', test(function() {
      TiAuth.DASHBOARD_URL = '://dashboard.com';
      var stub = spy();
      this.stub(Location, 'redirect', stub);
      TiAuth.signout();
      assert.calledWith(stub, '://dashboard.com/unauthorize');
    }));
  });
});
