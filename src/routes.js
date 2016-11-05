// Uses React Router as a wrapper to our components.
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Router, IndexRoute } from 'react-router';
import AppShell from './containers/AppShell';

// Polyfill for server side rendering of application
if (typeof require.ensure !== 'function') {
  // eslint-disable-next-line global-require
  require.ensure = require('isomorphic-ensure')({
    // If you require local files, pass the current location:
    dirname: __dirname,
  });
}
/**
 * webpack will bundle seperate files on require.ensure
 * and load each file in lazily to reduce initial load.
 */
export default (
   // App Shell
   <Route component={AppShell} path='/'>
    <IndexRoute getComponent={(next, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./containers/Home'));
      });
    }}/>
    <Route path='/storeToken' getComponent={(next, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./containers/StoreToken'));
      });
    }}/>
    <Route path='/logout' getComponent={(next, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./containers/Logout'));
      });
    }}/>
  </Route>
);
