import { combineReducers } from 'redux';
import authenticatedReducer from './authenticated';

const rootReducer = combineReducers({
  authenticated: authenticatedReducer
});

export default rootReducer;
