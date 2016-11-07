import MonzoApi from 'monzo-api';
import qs from 'querystring';
import jwt from 'jwt-simple';
import config from '../../../config'; // eslint-disable-line

class MonzoController {
  constructor() {
    this.api = new MonzoApi(config.MONZO.CLIENT_ID, config.MONZO.CLIENT_SECRET);
    this.api.redirectUrl = config.MONZO.REDIRECT_URL;
    this.loginPage = this.loginPage.bind(this);
    this.authorization = this.authorization.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  jwtToken(data) {
    data.iat = Date.now();
    return jwt.encode(data, config.JWT_SECRET);
  }

  loginPage(req, res) {
    let redUrl = this.api.authorizationUrl;
    delete req.session.user;
    if (req.session.monzoStateToken) {
      const split = redUrl.split('?');
      const parsed = qs.parse(split[1]);
      parsed.state = req.session.monzoStateToken;
      redUrl = `${split[0]}?${qs.stringify(parsed)}`;
    } else {
      req.session.monzoStateToken = this.api.stateToken;
    }
    req.session.redirectUrl = redUrl;
    res.redirect('/redirect');
  }

  authorization(req, res) {
    this.api.authenticate(req.query.code, req.query.state, req.session.monzoStateToken)
            .then((monzoReply) => {
              delete req.session.monzoStateToken;
              delete req.session.redirectUrl;
              const monzoData = {
                accessToken: monzoReply.access_token,
                refreshToken: monzoReply.refresh_token
              };
              const token = this.jwtToken(monzoData);
              // Store as a cookie as well in case we want to verify from the server side,
              // but we'll be using the jwt token to authenticate any server side requests
              req.session.user = token;
              res.redirect(`/storeToken?token=${token}`);
            })
            .catch(err => {
              delete req.session.monzoStateToken;
              delete req.session.redirectUrl;
              res.json({
                error: true,
                message: err.message
              });
            });
  }

  getBalance(req, res, extraData = {}) {
    const { accessToken } = req.user;
    const { accountId } = req.query;
    if (!accountId) {
      res.status(412).json({
        error: true,
        message: 'accountID needs to be provided'
      });
      return;
    }
    this.api.balance(accountId, accessToken)
        .then((monzoReply) => {
          extraData.data = monzoReply;
          res.json(extraData);
        })
        .catch(this.handleApiErrors.bind(this, req, res, this.getBalance));
  }

  handleApiErrors(req, res, whenReady, error) {
    const errorResponse = error.response;
    if (errorResponse &&
        errorResponse.statusCode === 401 &&
        errorResponse.body.message.indexOf('token is expired by') > -1) {
      this.refreshToken.call(this, req, res, whenReady);
    } else {
      res.status(412).json({
        error: true,
        message: errorResponse.body
      });
    }
  }

  getAccounts(req, res, extraData = {}, returnPromise = false) {
    const { accessToken } = req.user;
    const promise = this.api.accounts(accessToken);
    if (returnPromise) {
      return promise;
    }
    promise.then((monzoReply) => {
      extraData.data = monzoReply;
      res.json(extraData);
    })
    .catch(this.refreshToken.bind(this, req, res, this.getAccounts));
  }

  refreshToken(req, res, whenReady) {
    const { refreshToken } = req.user;
    this.api.refreshAccess(refreshToken)
        .then((monzoReply) => {
          const monzoData = {
            accessToken: monzoReply.access_token,
            refreshToken: monzoReply.refresh_token
          };
          const token = this.jwtToken(monzoData);
          req.session.user = token;
          // Replace the user data with the new one,
          // this way the request will continue as expected
          // Otherwise it will just loop
          req.user = monzoData;
          if (whenReady) {
            whenReady.call(this, req, res, { refreshToken: token });
          } else {
            res.redirect(`/storeToken?token=${token}`);
          }
        })
        .catch((err) => {
          res.json({
            error: true,
            message: err.message,
            logout: true
          });
        });
  }
}

export default new MonzoController();
