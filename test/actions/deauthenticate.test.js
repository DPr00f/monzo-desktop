import { deauthenticate } from '../../src/actions';
import { UNAUTH_USER } from '../../src/actions/types';

describe('deauthenticate Action ::', () => {
  it('must return UNAUTH_USER as type', () => {
    expect(deauthenticate()).to.contain({ type: UNAUTH_USER });
  });
});
