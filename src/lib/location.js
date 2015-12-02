import URL from 'url-parse';

export default {
  parse() {
    return new URL(global.location.href, true);
  },
  replace(destination) {
   global.history.replaceState({}, '', destination.href);
  },
  redirect(destination) {
    global.location.href = destination;
  }
};
