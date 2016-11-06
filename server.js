import logger from 'morgan';
import express from 'express';
import session from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import routes from './src/server/routes';

const app = express();

app.set('trust proxy', 1);
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(session({
  name: 'monzo-desktop',
  secret: config.SESSION_SECRET
}));

app.use('/dist', express.static(`${__dirname}/dist`));
app.use('/images', express.static(`${__dirname}/images`));
app.use(logger('combined'));
routes(app);

export default app;
