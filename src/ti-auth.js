import Auth from './lib/authentication';
import API from './lib/api';

function retrieve_user(resolve) {
  let token = Auth.token();
  API.get(this.API_URL + '/api/v1/users/me',
    resolve.bind(this, token),
    Auth.unauthorize
  );
}

export default {
  API_URL: '',
  DASHBOARD_URL: '',
  initialize(resolve) {
    if (!Auth.authorize()) {
      Auth.unauthorize();
      return;
    }
    retrieve_user.call(this, resolve);
  },
  signout() {
    Auth.unauthorize();
  }
};
