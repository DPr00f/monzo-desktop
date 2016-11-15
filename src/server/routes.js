import redirectController from './controllers/redirect';
import logoutController from './controllers/logout';
import monzoController from './controllers/monzo';
import requireAuth from './middlewares/requireAuth';
import cleanUpSession from './middlewares/cleanUpSession';
import handleRender from './middlewares/handleRender';

function getInitialStoreState(req) {
  return {
    authenticated: !!req.session.user
  };
}

export default (app) => {
  app.get('/redirect', redirectController);
  app.get('/logout', logoutController(false));
  app.get('/monzoLogin', monzoController.loginPage);
  app.get('/monzoReturn', monzoController.authorization);
  app.get('/api/logout', logoutController(true));
  app.get('/api/balance', requireAuth, monzoController.getBalance);
  app.get('/api/accounts', requireAuth, monzoController.getAccounts);
  app.use(cleanUpSession);
  app.use(handleRender(getInitialStoreState));
};
