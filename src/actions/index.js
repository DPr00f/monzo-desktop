import {
  AUTH_USER,
  UNAUTH_USER
} from './types';

export const authenticate = () => {
  return {
    type: AUTH_USER
  };
};

export const deauthenticate = () => {
  return {
    type: UNAUTH_USER
  };
};
