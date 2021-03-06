ti-auth.js
==========

`ti-auth.js` is a small wrapper to integrate modules into the [Travel
Intelligence Portal](https://travel-intelligence.com) providing:
- **Authentication** - unauthorized users will be redirected to the TI Portal
login page and will return after successful authentication.
- **User Context** - user information, preferences and grants are made available
to the application.
- **Utility functions** - for signout and reauthorization.


## Installation

via Bower:

```sh
$ bower install git@github.com:travel-intelligence/ti-auth.js --save
```

or via NPM:

```sh
$ npm install https://github.com/travel-intelligence/ti-auth.js --save-dev
```

## Quick Start

For ease of use the library exposes one global JavaScript object called `TiAuth`
to interact with.

After including the library in your application’s index.html file only 2 simple
steps are needed to use `ti-auth.js` for authentication:

1. **Configuration** - Specify the URLs of the Travel Intelligence API and the
   Portal you would like to use:

  ```javascript
  TiAuth.API_URL = 'https://api.travel-intelligence.com';
  TiAuth.DASHBOARD_URL = 'https://travel-intelligence.com';
  ```
  *Note:* If you fail to provide these two URLs before calling
  `TiAuth.initialize()` an exception is thrown.

2. **Authentication** - to bootstrap your application:

  ```javascript
  TiAuth.initialize(function(token, user) {
    // Bootstrap your application here
  });
  ```

  *Note:* See the [API documentation](#api) for more infos on the provided
  parameters.

## API

### `signout`

Use this to sign out the current user and take them back to the login page of
the TI Dashboard.

Example:

```javascript
TiAuth.signout();
```

### `reauthorize`

This allows you to make sure the current user is still authenticated. This is
especially helpful when a request your module makes is rejected by the API with
a `401` or `403` status code, indicating that the user’s token is no longer
valid.

Example:
```javascript
TiAuth.reauthorize();
```

*Note:* This will redirect them to the Dashboard and then back to your module if
they are still logged in, so make sure to persist any state you want to return
them to before calling this.

### `initialize` *(callback)*

This is the main interface that allows you to authenticate the user before
booting your application. The callback you provide is called after successful
authentication and should have the following signature:

```javascript
function(token, user);
```

The two optional parameters get you access to the user’s token and other
information as provided by the API.

The `user` object has the following properties:

- `admin` (boolean)
- `email` (string)
- `id` (number)
- `por_manager` (boolean)
- `preferences` (array)
- `resettable_password` (boolean)
- `search_favorites` (array)
- `subscriber_id` (number)

Use `token` to authenticate all requests your application is making to the
Travel Intelligence API by adding a custom request header following this format
(replace `<the-token>` with the value of the `token` parameter):

```
Authorization: Token <your-token-goes-here>
```

Example:
```javascript
TiAuth.initialize(function(token, user) {
  // Bootstrap and start your application here.
  // See below for framework-specific examples.
});
```

### `loadGrants` *(callback)*

This method allows you to load the grants information for the current user. See
the [API documentation](http://wiki.travel-intelligence.com/wiki/User_Access_
Control_for_Travel_Intelligence_Portal#Grants_Web_Service) of the TI API for 
further information about the endpoint.
In general this data should be used to restrict the UI and functionality of your
module according to the current user’s access rights.
The callback you provide is called after successfully loading the grants from
the API and should have the following signature:

```javascript
function(grants);
```

The optional parameter gets you access to the user’s grants array (as returned
from the API).

Example:

```javascript
TiAuth.loadGrants(function(grants) {
  // Use the grants information to restrict the UI of your module
});
```

*Note:* Only the `controls` portion of the API response is passed to the
callback. The other information, `user` and `admin`, is stripped as it’s already
part of the second argument passed to `TiAuth.initialize`.

## Framework Integration

`ti-auth.js` does not have any dependencies and works completely independently
from frameworks and libraries. At the same time it allows for seamless
integration with any framework you may choose for your module. In this section
you can find some example implementations for a few popular frameworks.

### Ember

The initialization can be done in Ember by creating a custom initializer.

1. Import `ti-auth.js` in `ember-cli-build.js`:

  ```javascript
  app.import('path/to/your/ti-auth.js');
  ```

2. Use Ember-CLI to create an initializer for ti-auth:

  ```sh
  $ ember generate initializer ti-auth
  ```

3. Edit `app/initializers/ti-auth.js` with the following content:

  ```javascript
  export default {
    name: 'waitForTiAuth',
    initialize: function(application) {
      application.deferReadiness();

      TiAuth.API_URL = 'https://api.travel-intelligence.com';
      TiAuth.DASHBOARD_URL = 'http://travel-intelligence.com';

      TiAuth.initialize(function(token, user) {
        application.set('token', token);
        application.advanceReadiness();
      });
    }
  };
  ```

*Note:* If you’re on a version of Ember >= 2.1 you probably want to use an
[`instanceInitializer`](https://guides.emberjs.com/v2.1.0/applications/initializers/#toc_application-instance-initializers)
here instead.

### Angular

1. Remove the `ng-app` attribute from the page root element.

2. Bootstrap your Angular app in the callback passed to `TiAuth.initialize`:

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

### Dependencies

These are dependencies that you need to have installed before being able to work
with the source files of this library.

- [`node`](http://nodejs.org/) >= 5.1.0
- [`npm`](https://www.npmjs.com/) >= 3.3.12
- [`make`](https://www.gnu.org/software/make/) >= 3.81

*Note:* These versions have been used in development. Older versions likely
still work but have not been officially tested.

### Setup

Clone the repository

```sh
$ git clone git@github.com:travel-intelligence/ti-auth.js.git
```

and install its dependencies

```sh
$ npm install
```

### Build

```sh
$ make
```

or use

```sh
$ make watch
```

to automatically watch for file changes and re-build the library.

### Tests

```sh
$ make test
```

### Distribute

To create a distributable file (that includes all modules and exposes the
`TiAuth` object), run

```sh
$ make dist
```

## FAQ

##### Why don’t you return a Promise instead of using a callback for `initialize`?

TiAuth is intended to be as portable and independent as possible. While Promises
already have [great browser support](http://caniuse.com/#feat=promises) they are
not the safest bet. Since some modules need to support older browsers (namely
IE) and any polyfill would add significant overhead to the library’s file size,
a callback is the best solution for now.

##### Why do you use `url-parse` as a dependency instead of using `window.URL`?

Because of [browser support](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#Browser_compatibility).
For a more detailed explanation, see the previous question.

## Author

[Joschka Kintscher](https://github.com/jkintscher)

## MIT License

Copyright (c) 2016 by Amadeus IT Group SA

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
