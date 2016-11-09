import cleanUpSession from '../../../src/server/middlewares/cleanUpSession';

describe('cleanUpSession Middleware ::', () => {
  let serverRequest;
  let serverResponse;
  beforeEach(() => {
    const { response, request } = getServerReqAndRes();
    serverRequest = request;
    serverResponse = response;
  });

  afterEach(() => {
    serverRequest = null;
    serverResponse = null;
  });

  it('should remove the session redirect url if one is avilable', () => {
    sinon.spy(serverResponse, 'redirect');
    serverRequest.session.redirectUrl = 'http://google.com';
    cleanUpSession(serverRequest, serverResponse, sinon.spy());
    expect(serverRequest.session.redirectUrl).to.not.be.ok; // eslint-disable-line
  });

  it('should call the next function', () => {
    const fakeNext = sinon.spy();
    sinon.spy(serverResponse, 'redirect');
    serverRequest.session.redirectUrl = 'http://google.com';
    cleanUpSession(serverRequest, serverResponse, fakeNext);
    expect(fakeNext).to.have.been.called; // eslint-disable-line
  });
});
