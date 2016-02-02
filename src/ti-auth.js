import Auth from './lib/authentication';
import API from './lib/api';

function retrieve_user(resolve) {
  let token = Auth.token();
  API.get(TiAuth.API_URL + '/api/v1/users/me',
    resolve.bind(null, token),
    Auth.unauthorize
  );
}

function validate_config() {
  if (TiAuth.API_URL === '') {
    throw new Error('`TiAuth.API_URL` needs to be configured.');
  }
  if (TiAuth.DASHBOARD_URL === '') {
    throw new Error('`TiAuth.DASHBOARD_URL` needs to be configured.');
  }
}

const TiAuth = {
  API_URL: '',
  DASHBOARD_URL: '',

  initialize(resolve) {
    validate_config();
    if (!Auth.authorize()) {
      Auth.unauthorize();
      return;
    }
    retrieve_user(resolve);
  },
  reauthorize() {
    Auth.unauthorize();
  }
};

export default TiAuth;
