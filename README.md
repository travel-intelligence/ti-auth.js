ti-auth.js
==========

`ti-auth.js` is a small wrapper to integrate modules into the [Travel Intelligence Portal](https://travel-intelligence.com) providing:
- **Authentication** - unauthorized users will be redirected to the TI Portal login page and will return after successful authentication.
- **User Context** - user information, preferences and grants are made available to the application.
- **Utility functions** - for signout and reauthorization.


## Installation
via Bower:

    $ bower install git@github.com:travel-intelligence/ti-auth.js --save

or via NPM:

    $ npm install https://github.com/travel-intelligence/ti-auth.js --save-dev

## Quick Start

For ease of use the library exposes one global JavaScript object called **TiAuth**.

After including the library in the in your application’s index.html file only 2 simple steps are needed to use `ti-auth.js` for authentication:

1. **Configuration** - depending on the target environment (production/staging/local etc.) the Travel Intelligence API and the
Portal URL need to be set. This can be done anywhere **before** the first call of the `TiAuth.initialize()`:

    ```javascript
    TiAuth.API_URL = 'https://api.travel-intelligence.com';
    TiAuth.DASHBOARD_URL = 'https://portal.travel-intelligence.com';
    ```

2. **Use the `initialize` method** - to bootstrap your application:

    ```javascript
    TiAuth.initialize(function(token, user) {
      //bootstrap your application here
    });
    ```

  `token` is the authentication token needed to call Travel Intelligence services

  `user` contains the user with its preferences

## Logout

`ti-auth.js` provides the ability to invalidate the current user session. It will automatically redirect the user to the login page.

```javascript
TiAuth.logout();
```

## Framework Integration
`ti-auth.js` is build to be independent from any specific framework. This enables either a stand-alone use or the integration with common JavaScript frameworks.

### Ember

The initialization can be done in ember by creating a custom initializer.

1. Import `ti-auth.js` in `ember-cli-build.js`:
 
  ```javascript
  app.import('bower_components/ti-auth.js/dist/ti-auth.min.js');
  ```
2. Create `app/initializers/ti-auth.js` with the following content:
  ```javascript
  import Ember from 'ember';

  var TiAuthInitializer = {
    name: 'waitForTiAuth',
    initialize: function(registry, application) {

      application.deferReadiness();

      TiAuth.API_URL = 'https://staging-api.travel-intelligence.com';
      TiAuth.DASHBOARD_URL = 'http://travel-intelligence.dev';

      TiAuth.initialize(function(token, user) {
        application.set('token', token);
        application.advanceReadiness();
      });
    }
  };

  export
  default TiAuthInitializer;
  ```
3. Import the initializer in the header of `app/app.js`:

  ```javascript
  import TiAuthInitializer from './initializers/ti-auth';
  ```
  .. and load it with the other modules:
  ```javascript
  loadInitializers(App, config.modulePrefix, TiAuthInitializer);
  ```

### Angular

1. Remove the `ng-app` attribute from the page root element.

2. Manually bootstrap the angular app in the call-back after initializing `ti-auth.js`.   

  ```javascript
  //configuration of the angular application
  var app = angular.module('app', [ ... ]);

  //initializing ti-auth.js
  TiAuth.initialize(function(token) {
    //bootstrap the angular app
    angular.element(document).ready(function() {
      yourApp.constant('token', token);
      angular.bootstrap(document, ['app']);
    });
  });
  ```

## Developer Corner

Just a few remarks for users intending to extend the `ti-auth.js` library.

### Setup
Clone the repository:

    $ git clone git@github.com:travel-intelligence/ti-auth.js.git

Install the required dependencies:

    $ npm install

### Tests

    $ make test

### Build

    $ make


---
## Author
Joschka Kintscher

## MIT License
Copyright (c) 2011 by Brian Noguchi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
