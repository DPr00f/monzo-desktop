import * as utils from '../../src/utils';
import store from '../../src/store';
import { REQUEST_COMPLETED, REQUEST_STARTED } from '../../src/actions/types';

describe('Utils ::', () => {
  describe('handleAxiosResponse ::', () => {
    beforeEach(() => {
      utils.setAmountOfRequests(1);
    });

    afterEach(() => {
      utils.setAmountOfRequests(0);
    });

    it('must parse content if content is json', () => {
      const response = '{"test": true}';
      sinon.spy(JSON, 'parse');
      utils.handleAxiosResponse(response, {
        'content-type': 'application/json; charset: utf8;'
      });
      expect(JSON.parse).to.have.been.calledWith(response);
      JSON.parse.restore();
    });

    it('must save the refreshToken if present in the response', () => {
      const response = { refreshToken: 'test' };
      sinon.spy(utils.localStorage, 'set');
      utils.handleAxiosResponse(response);
      expect(utils.localStorage.set).to.have.been.calledWith('token', response.refreshToken);
      utils.localStorage.set.restore();
    });

    it('must dispatch REQUEST_COMPLETE', () => {
      const response = { any: 'data' };
      sinon.spy(store, 'dispatch');
      utils.handleAxiosResponse(response);
      expect(store.dispatch).to.have.been.calledWith({ type: REQUEST_COMPLETED });
      store.dispatch.restore();
    });

    it('must not dispatch REQUEST_COMPLETE if data is different than JSON', () => {
      const response = 'any other data';
      sinon.spy(store, 'dispatch');
      utils.handleAxiosResponse(response);
      expect(store.dispatch).to.have.not.been.called; // eslint-disable-line
      store.dispatch.restore();
    });

    it('must not dispatch REQUEST_COMPLETE if there is an error in the data', () => {
      const response = { error: true, message: 'test' };
      sinon.spy(store, 'dispatch');
      utils.handleAxiosResponse(response);
      expect(store.dispatch).to.have.not.been.called; // eslint-disable-line
      store.dispatch.restore();
    });

    it('must not dispatch REQUEST_COMPLETE if the amount of requests is bigger than 1', () => {
      const response = { any: 'data' };
      sinon.spy(store, 'dispatch');
      utils.setAmountOfRequests(2);
      utils.handleAxiosResponse(response);
      expect(store.dispatch).to.have.not.been.called; // eslint-disable-line
      store.dispatch.restore();
    });
  });

  describe('handleAxiosRequest ::', () => {
    beforeEach(() => {
      utils.setAmountOfRequests(0);
    });

    afterEach(() => {
      utils.setAmountOfRequests(0);
    });

    it('must call REQUEST_STARTED', () => {
      const data = { any: 'data' };
      sinon.spy(store, 'dispatch');
      utils.handleAxiosRequest(data);
      expect(store.dispatch).to.have.been.calledWith({ type: REQUEST_STARTED });
      store.dispatch.restore();
    });

    it('must not call REQUEST_STARTED if the amount of requests is bigger than 1', () => {
      const data = { any: 'data' };
      sinon.spy(store, 'dispatch');
      utils.setAmountOfRequests(2);
      utils.handleAxiosRequest(data);
      expect(store.dispatch).to.have.not.been.called; // eslint-disable-line
      store.dispatch.restore();
    });
  });
});
