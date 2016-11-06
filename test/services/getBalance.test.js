import AxiosMockAdapter from 'axios-mock-adapter';
import getBalance from '../../src/services/getBalance';
import { GET_BALANCE } from '../../src/actions/types';
import { axios } from '../../src/utils';

const mock = new AxiosMockAdapter(axios);
const urlToTest = '/api/balance';

describe('getBalance Service ::', () => {
  afterEach(() => {
    mock.reset();
  });
  it('must call the next action regardless of the action', () => {
    const action = { type: 'UNKNOW_TYPE' };
    const nextSpy = callMiddleWare(getBalance, action);
    expect(nextSpy).to.have.been.calledWith(action);
  });

  it('dispatches GET_BALANCE_SUCCESS', (async) => {
    const action = { type: GET_BALANCE };
    mock.onGet(urlToTest).reply(200, {
      balance: 300
    });
    const nextSpy = callMiddleWare(getBalance, action);
    expect(nextSpy).to.have.been.calledWith(action);
    setTimeout(() => {
      expect(nextSpy).to.have.been.calledWith({ type: `${GET_BALANCE}_SUCCESS`, payload: { balance: 300 } });
      async();
    }, 0);
  });

  it('dispatches GET_BALANCE_FAILED', (async) => {
    const action = { type: GET_BALANCE };
    mock.onGet(urlToTest).reply(404, new Error('Mocked'));
    const nextSpy = callMiddleWare(getBalance, action);
    expect(nextSpy).to.have.been.calledWith(action);
    setTimeout(() => {
      expect(nextSpy).to.have.been.calledWithMatch({ type: `${GET_BALANCE}_FAILED` });
      async();
    }, 0);
  });
});
