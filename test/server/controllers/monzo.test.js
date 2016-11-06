import MonzoApi from 'monzo-api';
import nock from 'nock';
import monzoController from '../../../src/server/controllers/monzo';
import config from '../../../config';

const API_URL = 'https://api.monzo.com';

describe('monzo Controller ::', () => {
  let serverRequest;
  let serverResponse;
  let originalMonzoApi;
  let server;
  beforeEach(() => {
    const { response, request } = getServerReqAndRes();
    server = sinon.fakeServer.create();
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
    server.restore();
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
      setTimeout(() => {
        expect(serverResponse.redirect).to.have.been.calledWith(`/storeToken?token=${serverRequest.session.user}`);
        async();
      }, 5);
    });

    it('should redirect when auth is successful', (async) => {
      sinon.spy(serverResponse, 'json');
      serverRequest.query.code = 'sampleCode';
      serverRequest.query.state = 'sampleState';
      serverRequest.session.monzoStateToken = 'sampleState';
      nock(API_URL).post('/oauth2/token').reply(404, {});
      monzoController.authorization(serverRequest, serverResponse);
      setTimeout(() => {
        expect(serverResponse.json).to.have.been.calledWithMatch({ error: true });
        async();
      }, 5);
    });
  });
});
