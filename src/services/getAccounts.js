import { axios } from '../utils';
import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAILED
} from '../actions/types';

export default function getAccounts({ dispatch }) {
  return next => action => {
    next(action);
    switch (action.type) {
      case GET_ACCOUNTS:
        axios.get('/api/accounts')
            .then((response) => {
              dispatch({ type: GET_ACCOUNTS_SUCCESS, payload: response.data.data.accounts });
            })
            .catch((err) => {
              dispatch({ type: GET_ACCOUNTS_FAILED, message: err.message });
            });
        break;
      default:
        break;
    }
  };
}
