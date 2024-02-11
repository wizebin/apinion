import { Router, makeEndpoint } from 'apinion';
import aRouter from './endpoints/subrouterTypeA/aRouter.mjs';
import basicAuth from './endpoints/basicAuth.mjs';
import customAuth from './endpoints/customAuth.mjs';

const router = new Router();

router.enableCors();

router.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, 'from', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  next();
});

router.addErrorHandler(({ error, config, request, response }) => {
  console.error('error', request.originalUrl, error);

  if (error?.data?.fallthrough) {
    console.log('boop');
  }

  if (error?.status) {
    response.status(error.status).send({ message: error.message || 'unknown error' });
  } else {
    response.status(500).send({ message: 'Sorry we experienced an error' });
  }
});

router.addResponseCallback(({ request, response, status }) => {
  console.log('response', status, request.originalUrl);
});

router.addEarlyDisconnectCallback(({ request, response, status }) => {
  console.log('user disconnected early', status, request.originalUrl);
});

router.any('documentation', { name: 'documentation' }, () => {
  return Object.keys(router.getRoutes());
});

router.get('simulateError', { name: 'simulateError' }, () => {
  fakeFunction();
});

router.get('simulateHandledReject', { name: 'simulateHandledReject' }, () => {
  return Promise.reject(new Error('handled rejection'));
});

router.get('longRunning', { name: 'longRunning' }, async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return 'done';
});

router.applyRoutes(aRouter);
router.applyRoutes([{
  path: 'auth',
  subrouter: [
    { path: '/basic', any: basicAuth },
    { path: 'custom', any: customAuth },
  ],
}])

console.log('starting server at http://localhost:5550/');
router.listen(5550);
