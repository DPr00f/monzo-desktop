import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, browserHistory, match } from 'react-router';
import routes from './routes';
import store from './store';
import '../scss/styles.scss';

match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
  render(
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>,
    document
  );
});
