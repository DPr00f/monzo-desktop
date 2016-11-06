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

  getBalance(req, res) {
    const { accessToken, refreshToken } = req.user;
    this.api.accounts(accessToken)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
    res.json({ error: false, balance: 300 });
  }
}

export default new MonzoController();
