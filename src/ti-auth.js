import Authentication from './lib/authentication';
import Request from './lib/request';

export default {
  initialize(resolve) {
    if (Authentication.authorize()) {
      Request.get('http://localhost:3000/api/users/me',
                  resolve,
                  Authentication.unauthorize);
    } else {
      Authentication.unauthorize();
    }
  }
};
