import authenticatedReducer from '../../src/reducers/authenticated';
import {
  AUTH_USER,
  UNAUTH_USER
} from '../../src/actions/types';

describe('authenticated Reducer ::', () => {
  describe('action.type = AUTH_USER ::', () => {
    it('Needs to return true', () => {
      const prevState = false;
      const nextState = true;
      expect(authenticatedReducer(prevState, { type: AUTH_USER })).to.equal(nextState);
    });
  });
  describe('action.type = UNAUTH_USER ::', () => {
    it('Needs to return false', () => {
      const prevState = true;
      const nextState = false;
      expect(authenticatedReducer(prevState, { type: UNAUTH_USER })).to.equal(nextState);
    });
  });
});
