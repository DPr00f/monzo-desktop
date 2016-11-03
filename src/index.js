import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, browserHistory, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';
import routes from './routes';
import '../scss/styles.scss';

const loggerMiddleware = createLogger();

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__INITIAL_STATE__;
// const store = createStore(
//   rootReducer,
//   initialState,
//   applyMiddleware(
//     thunkMiddleware, // lets us dispatch() functions
//     loggerMiddleware // neat middleware that logs actions
//   )
// );

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(createStore);

match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
  render(
    <Provider store={createStoreWithMiddleware(reducers, initialState)}>
      <Router {...renderProps} />
    </Provider>,
    document.getElementById('root-app')
  );
});
