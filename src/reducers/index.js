import { combineReducers } from 'redux';
import authenticatedReducer from './authenticated';
import genericRequest from './genericRequest';

const rootReducer = combineReducers({
  authenticated: authenticatedReducer,
  requests: genericRequest
});

export default rootReducer;
