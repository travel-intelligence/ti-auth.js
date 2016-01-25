import Auth from './lib/authentication';
import API from './lib/api';

export default {
  API_URL: '',
  DASHBOARD_URL: '',
  initialize(resolve) {
    if (!Auth.authorize()) {
      Auth.unauthorize();
      return;
    }
    let token = Auth.token();
    API.get(this.API_URL + '/api/v1/users/me',
      resolve.bind(this, token),
      Auth.unauthorize
    );
  },
  signout() {
    Auth.unauthorize();
  }
};
