import {
  REQUEST_STARTED,
  REQUEST_COMPLETED,
  REQUEST_FAILED
} from '../actions/types';

export default function genericRequest(state = {}, action) {
  switch (action.type) {
    case REQUEST_STARTED:
      return { ...state, loading: true, message: '' };
    case REQUEST_COMPLETED:
      return { ...state, loading: false, message: '' };
    case REQUEST_FAILED:
      return { ...state, loading: false, message: action.message };
    default:
      return state;
  }
}
