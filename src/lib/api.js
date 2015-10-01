import Authentication from './authentication';

let host = 'http://portal.travel-intelligence.dev';

function request(method, url, success, error) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, host + url, true);
  xhr.onreadystatechange = handler;
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Authorization', 'Token ' + Authentication.token());
  xhr.send();

  function handler() {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        success(this.response);
      } else {
        error(this);
      }
    }
  };
}

export default {
  get: request.bind(this, 'GET')
};
