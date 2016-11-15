import { combineReducers } from 'redux';
import authenticatedReducer from './authenticated';
import accountsReducer from './accounts';
import genericRequest from './genericRequest';

const rootReducer = combineReducers({
  authenticated: authenticatedReducer,
  requests: genericRequest,
  accounts: accountsReducer
});

export default rootReducer;
