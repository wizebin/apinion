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
  it('keeps a body that middleware already parsed', async () => {
    const router = new apinion.Router();

    // Stands in for multer / body-parser: drains the request stream and puts its
    // own parsed values on request.body before the endpoint runs.
    const consumingMiddleware = (request, response, next) => {
      request.resume();
      request.on('end', () => {
        request.body = { book_hash: 'abc123' };
        next();
      });
    };

    router.post('/upload', {
      required: ['book_hash'],
      middleware: consumingMiddleware,
    }, ({ required }) => `hash ${required.book_hash}`);

    await router.listen(65513);
    const fetchResult = await fetch('http://localhost:65513/upload', { method: 'POST', body: 'file-bytes' });
    expect(await fetchResult.text()).toEqual('hash abc123');
    router.close();
  });
  it('still parses the body when middleware left it empty', async () => {
    const router = new apinion.Router();

    // body-parser style no-op: assigns an empty body without touching the stream
    // when the content type is not its own. Apinion must still parse the body.
    const nonConsumingMiddleware = (request, response, next) => {
      request.body = {};
      next();
    };

    router.post('/', {
      required: ['secret'],
      middleware: nonConsumingMiddleware,
    }, ({ required }) => `your secret is ${required.secret}`);

    await router.listen(65514);
    const fetchResult = await fetch('http://localhost:65514/', { method: 'POST', body: JSON.stringify({ secret: 'ploonga' }) });
    expect(await fetchResult.text()).toEqual('your secret is ploonga');
    router.close();
  });
  it('keeps middleware body values alongside the parsed body', async () => {
    const router = new apinion.Router();

    // Never touches the stream, it just stamps a server derived value onto the
    // body. Both that value and the caller's body have to survive.
    const injectingMiddleware = (request, response, next) => {
      request.body = { tenant: 'acme' };
      next();
    };

    router.post('/', { middleware: injectingMiddleware }, ({ body }) => body);

    await router.listen(65515);
    const fetchResult = await fetch('http://localhost:65515/', {
      method: 'POST',
      body: JSON.stringify({ secret: 'ploonga', tenant: 'client-override-attempt' }),
    });
    expect(await fetchResult.json()).toEqual({ secret: 'ploonga', tenant: 'acme' });
    router.close();
  });
  it('lets middleware replace the body outright with _body', async () => {
    const router = new apinion.Router();

    // Never touches the stream, but claims the body the way the express
    // ecosystem spells it, so the caller's body must be dropped entirely.
    const replacingMiddleware = (request, response, next) => {
      request.body = { onlyTheseValues: true };
      request._body = true;
      next();
    };

    router.post('/', { middleware: replacingMiddleware }, ({ body }) => body);

    await router.listen(65518);
    const fetchResult = await fetch('http://localhost:65518/', {
      method: 'POST',
      body: JSON.stringify({ secret: 'ploonga' }),
    });
    expect(await fetchResult.json()).toEqual({ onlyTheseValues: true });
    router.close();
  });
  it('leaves raw defined when middleware already drained the stream', async () => {
    const router = new apinion.Router();

    const consumingMiddleware = (request, response, next) => {
      request.resume();
      request.on('end', () => {
        request.body = { alpha: 'beta' };
        next();
      });
    };

    router.post('/', { middleware: consumingMiddleware }, ({ request, body }) => ({
      rawLength: request.raw.length,
      body,
    }));

    await router.listen(65516);
    const fetchResult = await fetch('http://localhost:65516/', { method: 'POST', body: 'file-bytes' });
    expect(await fetchResult.json()).toEqual({ rawLength: 0, body: { alpha: 'beta' } });
    router.close();
  });
  it('gives endpoints a destructurable body when there is nothing to parse', async () => {
    const router = new apinion.Router();

    router.get('/', null, ({ body }) => {
      const { anything } = body; // must not throw
      return { keys: Object.keys(body), anything: anything === undefined };
    });

    await router.listen(65517);
    const fetchResult = await fetch('http://localhost:65517/');
    expect(await fetchResult.json()).toEqual({ keys: [], anything: true });
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
