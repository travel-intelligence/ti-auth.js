import Authentication from './lib/authentication';
import API from './lib/api';

export default {
  initialize(resolve) {
    if (!Authentication.authorize()) {
      Authentication.unauthorize();
      return;
    }
    let token = Authentication.token();
    API.get('/api/v1/users/me',
      resolve.bind(this, token),
      Authentication.unauthorize
    );
  }
};
