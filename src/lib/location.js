import url from 'url';

export default {
  parse() {
    return url.parse(global.location.href, true);
  },
  replace(new_location) {
    global.history.replaceState({}, '', url.format(new_location));
  },
  redirect(new_location) {
    global.location.href = new_location;
  }
};