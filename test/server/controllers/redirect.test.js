import redirectController from '../../../src/server/controllers/redirect';

describe('redirect Controller ::', () => {
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

  it('must redirect if session.redirectUrl is available', () => {
    sinon.spy(serverResponse, 'redirect');
    serverRequest.session.redirectUrl = 'http://joaolopes.info/';
    redirectController(serverRequest, serverResponse);
    expect(serverResponse.redirect).to.have.been.calledWith(serverRequest.session.redirectUrl);
    serverResponse.redirect.restore();
    delete serverRequest.session.redirectUrl;
  });

  it("must return an error if there isn't a redirectUrl in the session", () => {
    sinon.spy(serverResponse, 'json');
    redirectController(serverRequest, serverResponse);
    expect(serverResponse.json).to.have.been.calledWithMatch({ message: 'Unknown redirect page' });
    serverResponse.json.restore();
  });
});
