import { axios } from '../utils';
import {
  GET_BALANCE,
  GET_BALANCE_SUCCESS,
  GET_BALANCE_FAILED
} from '../actions/types';

export default function getBalance({ dispatch }) {
  return next => action => {
    next(action);
    switch (action.type) {
      case GET_BALANCE:
        axios.get('/api/balance')
            .then((response) => {
              dispatch({ type: GET_BALANCE_SUCCESS, payload: response.data });
            })
            .catch((err) => {
              dispatch({ type: GET_BALANCE_FAILED, message: err.message });
            });
        break;
      default:
        break;
    }
  };
}
