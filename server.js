import logger from 'morgan';
import express from 'express';
import session from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config'; // eslint-disable-line import/default
import redirectController from './src/server/controllers/redirect';
import monzoController from './src/server/controllers/monzo';
import cleanUpSession from './src/server/middlewares/cleanUpSession';
import handleRender from './src/server/middlewares/handleRender';

const app = express();

function getInitialStoreState(req) {
  return {
    authenticated: !!req.session.user
  };
}

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
app.get('/redirect', redirectController);
app.get('/monzoLogin', monzoController.loginPage);
app.get('/monzoReturn', monzoController.authorization);
app.use(cleanUpSession);
app.use(handleRender(getInitialStoreState));

export default app;
