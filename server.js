import logger from 'morgan';
import express from 'express';
import session from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import qs from 'querystring';
import config from './config'; // eslint-disable-line import/default
import monzoController from './src/server/controllers/monzo';
import handleRender from './src/server/middlewares/handleRender';

const app = express();

global.app = app;

app.set('trust proxy', 1);
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(session({
  name: 'monzo-desktop',
  secret: config.SESSION_SECRET
}));

// Register static assets to serve from server.
app.use('/dist', express.static(`${__dirname}/dist`));
app.use('/images', express.static(`${__dirname}/images`));
// Register middleware.
app.use(logger('combined'));
app.use((req, res, next) => {
  if (req.session.user) {
    app.locals.logged = true;
  }
  next();
});
app.get('/redirect', (req, res) => {
  if (req.session.redirectUrl) {
    res.redirect(req.session.redirectUrl);
  } else {
    res.json({
      error: true,
      message: 'Unknown redirect page'
    });
  }
});
app.get('/monzoLogin', monzoController.loginPage);
app.get('/monzoReturn', monzoController.authorization);
app.use((req, res, next) => {
  if (req.session.redirectUrl) {
    delete req.session.redirectUrl;
  }
  next();
});
app.use(handleRender);

export default app;
