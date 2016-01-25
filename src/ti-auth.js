import Auth from './lib/authentication';
import API from './lib/api';

function retrieve_user(resolve) {
  let token = Auth.token();
  API.get(TiAuth.API_URL + '/api/v1/users/me',
    resolve.bind(null, token),
    Auth.unauthorize
  );
}

const TiAuth = {
  API_URL: '',
  DASHBOARD_URL: '',
  initialize(resolve) {
    if (!Auth.authorize()) {
      Auth.unauthorize();
      return;
    }
    retrieve_user(resolve);
  },
  signout() {
    Auth.unauthorize();
  }
};

export default TiAuth;
