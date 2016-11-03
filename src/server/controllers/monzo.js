import MonzoApi from 'monzo-api';
import qs from 'querystring';
import config from '../../../config'; // eslint-disable-line

function redirectPage(redirectUrl) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="refresh" content="0;URL='${redirectUrl}'" />
        <title>Monzo Desktop</title>
      </head>
      <body>
      <p><a href="${redirectUrl}">Click here if your page doesn't automatically redirect.</a></p>
      </body>
    </html>`;
}

class MonzoController {
  constructor() {
    this.api = new MonzoApi(config.MONZO.CLIENT_ID, config.MONZO.CLIENT_SECRET);
    this.api.redirectUrl = config.MONZO.REDIRECT_URL;
    this.loginPage = this.loginPage.bind(this);
    this.authorization = this.authorization.bind(this);
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
      req.session.monzoStateToken = this.api._stateToken;
    }
    req.session.redirectUrl = redUrl;
    res.redirect('/redirect');
  }

  authorization(req, res) {
    this.api.authenticate(req.query.code, req.query.state, req.session.monzoStateToken)
            .then((monzoReply) => {
              delete req.session.monzoStateToken;
              delete req.session.redirectUrl;
              req.session.user = {
                accessToken: monzoReply.access_token,
                refreshToken: monzoReply.refresh_token
              };
              res.redirect('/');
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
}

export default new MonzoController();
