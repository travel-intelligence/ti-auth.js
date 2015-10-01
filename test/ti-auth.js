import { expect } from 'chai';
import { test, spy, assert } from 'sinon';

import TiAuth from '../src/ti-auth';

// Internal dependencies to stub
import Authentication from '../src/lib/authentication';
import API from '../src/lib/api';

describe('TiAuth', () => {
  before(function() {
    if (!global.location) {
      global.location = { href: 'http://ti-module.test/' };
    }
  });

  describe('#initialize', () => {
   it('attempts to authorize the user', test(function() {
     this.stub(Authentication, 'authorize', () => true);
     this.stub(API, 'get');
     TiAuth.initialize();
   }));

    it('unauthorizes if authorization failed', test(function() {
      this.stub(Authentication, 'authorize', false);
      var stub = spy();
      this.stub(Authentication, 'unauthorize', stub);
      TiAuth.initialize();
      assert.calledOnce(stub);
    }));

    it('loads user from API', test(function() {
      this.stub(Authentication, 'authorize', () => true);
      this.mock(API).expects('get').withArgs('/api/v1/users/me');
      TiAuth.initialize();
    }));

    it('unauthorizes if request to API failed', test(function() {
      this.stub(Authentication, 'authorize', () => true);
      this.stub(API, 'get', function(url, success, error) {
        error('Nope.');
      });
      var stub = spy();
      this.stub(Authentication, 'unauthorize', stub);
      TiAuth.initialize();
      assert.calledOnce(stub);
    }));

    it('resolves with user object on success', test(function() {
      var user = { name: 'Joschka' };
      this.stub(Authentication, 'authorize', () => true);
      this.stub(API, 'get', function(url, success, error) {
        success(user);
      });
      var callback = spy();
      TiAuth.initialize(callback);
      assert.calledOnce(callback);
      assert.calledWith(callback, user);
    }));
  });
});
