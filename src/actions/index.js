import {
  AUTH_USER,
  UNAUTH_USER,
  GET_BALANCE
} from './types';


export const authenticate = () => ({
  type: AUTH_USER
});

export const deauthenticate = () => ({
  type: UNAUTH_USER
});

export const getBalance = () => ({
  type: GET_BALANCE
});
