import Authentication from './lib/authentication';
import API from './lib/api';

export default {
  initialize(resolve) {
    if (Authentication.authorize()) {
      API.get('http://portal.travel-intelligence.dev/api/v1/users/me',
              resolve,
              Authentication.unauthorize);
    } else {
      Authentication.unauthorize();
    }
  }
};
