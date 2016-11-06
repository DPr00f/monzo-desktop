import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';
import services from '../services';
import createLogger from 'redux-logger';

const dontApplyCustomMiddlewaresIn = ['production', 'testing'];

function loggerMiddleware() {
  if (dontApplyCustomMiddlewaresIn.indexOf(process.env.NODE_ENV) === -1) {
    return createLogger();
  }
  return function empty() {
    return next => action => {
      next(action);
    };
  };
}

function reduxDevTools() {
  if (dontApplyCustomMiddlewaresIn.indexOf(process.env.NODE_ENV) === -1) {
    // eslint-disable-next-line no-underscore-dangle
    return global.__REDUX_DEVTOOLS_EXTENSION__ && global.__REDUX_DEVTOOLS_EXTENSION__();
  }
}

// eslint-disable-next-line no-underscore-dangle
const initialState = global.__INITIAL_STATE__;
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware(), ...services)(createStore);
const store = createStoreWithMiddleware(reducers, initialState, reduxDevTools());

export default store;
