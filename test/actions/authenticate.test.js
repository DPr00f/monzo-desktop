import { authenticate } from '../../src/actions';
import { AUTH_USER } from '../../src/actions/types';

describe('authenticate Action ::', () => {
  it('must return AUTH_USER as type', () => {
    expect(authenticate()).to.contain({ type: AUTH_USER });
  });
});
