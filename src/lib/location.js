import url from 'url';

export default {
  parse() {
    return url.parse(global.location.href, true);
  },
  replace(new_location) {
    global.history.replaceState({}, '', url.format(new_location));
  }
};
