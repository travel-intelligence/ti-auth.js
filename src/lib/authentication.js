import location from './location';

let AUTH_TOKEN;

export default {
  token() {
    return AUTH_TOKEN;
  },
  authorize() {
    let uri = location.parse();
    AUTH_TOKEN = uri.query.auth_token || undefined;

    if (!AUTH_TOKEN) { return false; }

    delete uri.query.auth_token;
    location.replace(uri);

    return true;
  }
};
