import MonzoApi from 'monzo-api';
import nock from 'nock';
import monzoController from '../../../src/server/controllers/monzo';
import config from '../../../config';

const API_URL = 'https://api.monzo.com';

describe('monzo Controller ::', () => {
  let serverRequest;
  let serverResponse;
  let originalMonzoApi;
  beforeEach(() => {
    const { response, request } = getServerReqAndRes();
    serverRequest = request;
    serverResponse = response;
    originalMonzoApi = monzoController.api;
    config.MONZO.CLIENT_ID = 'fakeClientId';
    config.MONZO.CLIENT_SECRET = 'fakeClientSecret';
    monzoController.api = new MonzoApi('fakeClientId', 'fakeClientSecret');
    monzoController.api.redirectUrl = 'http://joaolopes.info';
  });

  afterEach(() => {
    serverRequest = null;
    serverResponse = null;
    monzoController.api = originalMonzoApi;
  });

  describe('jwtToken ::', () => {
    const oldDateNow = Date.now;
    const oldJwtSecret = config.JWT_SECRET;
    beforeEach(() => {
      Date.now = () => 1;
      config.JWT_SECRET = 'abc';
    });

    afterEach(() => {
      Date.now = oldDateNow;
      config.JWT_SECRET = oldJwtSecret;
    });

    it('needs to be able to generate a valid token', () => {
      const token = monzoController.jwtToken({ test: 'sample' });
      expect(token).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZXN0Ijoic2FtcGxlIiwiaWF0IjoxfQ.4eTzREec9BM-t3oOfqcBP3KeZY-MYTC5tky-KWggXqU');
    });
  });

  describe('loginPage ::', () => {
    it('must redirect to the monzoApi url', () => {
      sinon.spy(serverResponse, 'redirect');
      serverRequest.session.redirectUrl = null;
      monzoController.loginPage(serverRequest, serverResponse);
      expect(serverResponse.redirect).to.have.been.calledWith('/redirect');
      expect(serverRequest.session.redirectUrl).to.contain(`state=${monzoController.api.stateToken}`);
    });

    it('must replace the state token if one already exists', () => {
      const stateToken = 'fakeToken';
      sinon.spy(serverResponse, 'redirect');
      serverRequest.session.monzoStateToken = stateToken;
      monzoController.loginPage(serverRequest, serverResponse);
      expect(serverResponse.redirect).to.have.been.calledWith('/redirect');
      expect(serverRequest.session.redirectUrl).to.contain(`state=${stateToken}`);
    });
  });

  describe('authorization Controller ::', () => {
    it('should redirect when auth is successful', (async) => {
      sinon.spy(serverResponse, 'redirect');
      serverRequest.query.code = 'sampleCode';
      serverRequest.query.state = 'sampleState';
      serverRequest.session.monzoStateToken = 'sampleState';
      nock(API_URL).post('/oauth2/token').reply(200, { yes: 'it works !' });
      monzoController.authorization(serverRequest, serverResponse);
      whenCalled(serverResponse.redirect, () => {
        expect(serverResponse.redirect).to.have.been.calledWith(`/storeToken?token=${serverRequest.session.user}`);
        async();
      });
    });

    it('should display error when auth is unsuccessful', (async) => {
      sinon.spy(serverResponse, 'json');
      serverRequest.query.code = 'sampleCode';
      serverRequest.query.state = 'sampleState';
      serverRequest.session.monzoStateToken = 'sampleState';
      nock(API_URL).post('/oauth2/token').reply(404, {});
      monzoController.authorization(serverRequest, serverResponse);
      whenCalled(serverResponse.json, () => {
        expect(serverResponse.json).to.have.been.calledWithMatch({ error: true });
        async();
      });
    });
  });

  describe('getBalance ::', () => {
    it("should fail if the accountId isn't provided", () => {
      sinon.spy(serverResponse, 'json');
      monzoController.getBalance(serverRequest, serverResponse);
      expect(serverResponse.json).to.have.been.calledWithMatch({ error: true, message: 'accountID needs to be provided' });
    });

    it('should get the data and return it to the user', (async) => {
      sinon.spy(serverResponse, 'json');
      serverRequest.query.accountId = 'sampleId';
      nock(API_URL)
        .get('/balance')
        .reply(200, { balance: 300, currency: 'GBP' });
      monzoController.getBalance(serverRequest, serverResponse);
      whenCalled(serverResponse.json, () => {
        expect(serverResponse.json).to.have.been.calledWithMatch({ data: { balance: 300, currency: 'GBP' } });
        async();
      });
    });

    it('should call handleApiErrors if an error occurs', (async) => {
      sinon.spy(monzoController, 'handleApiErrors');
      serverRequest.query.accountId = 'sampleId';
      nock(API_URL)
        .get('/balance')
        .reply(404, {});
      monzoController.getBalance(serverRequest, serverResponse);
      whenCalled(monzoController.handleApiErrors, () => {
        expect(monzoController.handleApiErrors).to.have.been.calledWithMatch(serverRequest, serverResponse);
        async();
      });
    });
  });
});
