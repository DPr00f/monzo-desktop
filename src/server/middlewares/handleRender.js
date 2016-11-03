import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import routes from '../../routes';
import appBehaviour from '../../reducers';

/** Returns a rendered string including your initial state
  / and initial render.
  */
function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Monzo Desktop</title>
        <link type="text/css" rel="stylesheet" href="dist/main.css" />
      </head>
      <body>
        <div id="root-app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script async type="application/javascript" src="dist/bundle.js"></script>
      </body>
    </html>`;
}

export default (initialStoreStateCallback) => (req, res) => {
  // Matches the incoming request with a potential route in the react app.
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }
    // If no route is found return a 404.
    if (!renderProps) {
      return res.status(404).end('Not found.');
    }

    // Initialise our redux store with out reducers.
    const store = createStore(appBehaviour, initialStoreStateCallback(req, res));
    // Initialise the componenet with the store
    // and rendered properties.
    const InitialComponent = (
      <Provider store={store} >
        <RouterContext {...renderProps} />
      </Provider>
    );
    const componentHTML = renderToString(InitialComponent);
    // Grab the initial state from our Redux store
    const initialState = store.getState();
    // Send the rendered page back to the client
    // including any initial state from redux.
    res.status(200).send(renderFullPage(componentHTML, initialState));
  });
};
