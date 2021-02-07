import * as apinion from '..';
import fetch from 'node-fetch';

describe('basic tests', () => {
  it('exports bare minimums', () => {
    expect(!!apinion.Router).toEqual(true);
    expect(!!apinion.HttpError).toEqual(true);
    expect(!!apinion.makeEndpoint).toEqual(true);
    expect(!!apinion.makeBasicAuthenticator).toEqual(true);
    expect(!!apinion.makeBearerTokenAuthenticator).toEqual(true);
    expect(!!apinion.makeHardcodedBasicAuthenticator).toEqual(true);
    expect(!!apinion.makeRequestAuthenticator).toEqual(true);
  });
  it('makes a router', async () => {
    const router = new apinion.Router();
    router.get('/', null, () => 'toasty');
    await router.listen(65510);
    const fetchResult = await fetch('http://localhost:65510/');
    expect(await fetchResult.text()).toEqual('toasty');
    router.close();
  });
  it('uses router arrays correctly', async () => {
    const router = new apinion.Router();

    const endpoint = {
      config: { required: ['secret'] },
      callback: ({ required }) => {
        return 'your secret is ' + required.secret;
      }
    };

    const anotherEndpoint = apinion.makeEndpoint({ name: 'test' }, () => {
      return [1, 2, 3];
    });

    const routeArray = [
      { path: 'v1', subrouter: [
        { path: '/some_secret', post: endpoint },
      ]},
      { path: '/test', get: anotherEndpoint },
    ];
    router.applyRoutes(routeArray);

    await router.listen(65511);

    {
      const fetchResult = await fetch('http://localhost:65511/v1/some_secret', { method: 'POST', body: JSON.stringify({ secret: 'ploonga' }) });
      expect(await fetchResult.text()).toEqual('your secret is ploonga');
    }

    {
      const fetchResult = await fetch('http://localhost:65511/test');
      expect(await fetchResult.json()).toEqual([1, 2, 3]);
    }

    router.close();
  });
  it('responds correctly when throwing an error', async () => {
    const router = new apinion.Router();
    router.get('/', null, () => {
      throw new apinion.HttpError({ status: 415, message: 'I have 415 problems' });
    });
    await router.listen(65512);
    const fetchResult = await fetch('http://localhost:65512/');
    expect(fetchResult.status).toEqual(415);
    expect(await fetchResult.json()).toEqual({ message: 'I have 415 problems' });
    router.close();
  });
  it('gets routes as expected', async () => {
    const router = new apinion.Router();
    router.get('/', null, () => '/');
    router.get('/jerry/springo', null, () => '/');
    router.get('/embargo', null, () => '/');
    router.get('/test', null, () => '/');
    router.get('test2', null, () => '/');
    router.get('springy/springum', null, () => '/');

    expect(Object.keys(router.getRoutes())).toEqual(['/', '/jerry/springo', '/embargo', '/test', '/test2', '/springy/springum']);
  });
});
