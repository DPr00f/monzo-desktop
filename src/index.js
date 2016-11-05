import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, browserHistory, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import routes from './routes';
import { logger as loggerMiddleware, reduxDevTools } from './utils';
import '../scss/styles.scss';

// eslint-disable-next-line no-underscore-dangle
const initialState = global.__INITIAL_STATE__;

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware())(createStore);
const store = createStoreWithMiddleware(reducers, initialState, reduxDevTools());

match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
  render(
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>,
    document
  );
});
