import Authentication from './lib/authentication';
import API from './lib/api';

export default {
  initialize(resolve) {
    if (Authentication.authorize()) {
      API.get('http://localhost:3000/api/v1/users/me',
              resolve,
              Authentication.unauthorize);
    } else {
      Authentication.unauthorize();
    }
  }
};
