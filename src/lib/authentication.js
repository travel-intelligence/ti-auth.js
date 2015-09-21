import url from 'url';

var AUTH_TOKEN;

export function authorize() {
  let uri = url.parse(global.location, true);
  AUTH_TOKEN = uri.query.auth_token || undefined;

  if (!AUTH_TOKEN) { return false; }

  delete uri.query.auth_token;
  global.history.replaceState({}, '', url.format(uri));

  return true;
}
