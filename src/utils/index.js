import store from 'store';
import createLogger from 'redux-logger';

export const localStorage = store;

export function logger() {
  if (process.env.NODE_ENV !== 'production') {
    return createLogger();
  }
}

export function reduxDevTools() {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-underscore-dangle
    return global.__REDUX_DEVTOOLS_EXTENSION__ && global.__REDUX_DEVTOOLS_EXTENSION__();
  }
}
