import {
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAILED
} from '../actions/types';

export default function accounts(state = [], action) {
  const accs = [];
  switch (action.type) {
    case GET_ACCOUNTS_SUCCESS:
      return accs.concat(state, action.payload);
    case GET_ACCOUNTS_FAILED:
      return accs;
    default:
      return state;
  }
}
