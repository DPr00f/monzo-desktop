import logoutController from '../../../src/server/controllers/logout';

describe('logout Controller ::', () => {
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

  it('must respond with "Logout successfuly" as a message', () => {
    sinon.spy(serverResponse, 'json');
    logoutController(true)(serverRequest, serverResponse);
    expect(serverResponse.json).to.have.been.calledWithMatch({
      message: 'Logout successfully'
    });
    serverResponse.json.restore();
  });

  it("must call next if 'respond' param is false", () => {
    const nextSpy = sinon.spy();
    logoutController(false)(serverRequest, serverResponse, nextSpy);
    expect(nextSpy).to.have.been.called; // eslint-disable-line
  });
});
