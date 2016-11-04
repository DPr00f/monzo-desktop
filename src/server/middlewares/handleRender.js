import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { format } from 'util';
import routes from '../../routes';
import appBehaviour from '../../reducers';

const TEMPLATE = 'var __INITIAL_STATE__ = %s;';
const DOCTYPE = '<!DOCTYPE html>';

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
    // Initialise the component with the store
    // and rendered properties.
    const InitialComponent = (
      <Provider store={store} >
        <RouterContext {...renderProps} />
      </Provider>
    );
    const componentHTML = renderToString(InitialComponent);
    // Grab the initial state from our Redux store
    const initialState = store.getState();
    const script = format(TEMPLATE, JSON.stringify(initialState));
    // Send the rendered page back to the client
    // including any initial state from redux.
    const html = DOCTYPE + componentHTML.replace('</head>', `<script type="application/javascript">${script}</script></head>`);
    res.status(200).send(html);
  });
};
