## APInion
#### an opinionated API framework built on express

* Presently this framework is not ready for production use outside of my own projects, proceed at your own risk.

## Quick Start

The fastest way to get started from scratch:

```bash
mkdir my-api
cd my-api
npm init -y
npm install --save apinion
```

Then create a file called `index.mjs` with the following contents (or any contents from the examples above):

```javascript
import { Router } from 'apinion';

const router = new Router();

router.enableCors();

router.get('/', { name: 'root' }, () => {
  return {
    hello: 'world',
  };
});

router.listen(9166);
```

Then run `node index.mjs` and you should be able to hit `http://localhost:9166` and see the response.

Consider modifying your package json's scripts to include the start script:

```json
"scripts": {
  "start": "node --experimental-modules index.mjs"
},
```

## API Documentation

```javascript
import { Router } from 'apinion';

const router = new Router();

router.enableCors();

router.get('/endpoint', { name: 'name' }, () => {
  return {
    data: 'this will be returned as json to the end user'
  };
});

router.listen(9512);
```

### helmet recommended

```javascript
import helmet from 'helmet';
import { Router } from 'apinion';

const router = new Router();
router.use(helmet());

router.listen(9494);
```

### using middleware like multer

```javascript
import multer from 'multer';
import { Router } from 'apinion';

const router = new Router();

router.get('/upload', { middleware: multer({ dest: '/tmp/' }).single('File') }, ({ request }) => {
  // do whatever you want with request.file, request.file.path contains the temporary file path
});

router.listen(5934);
```

### using router arrays

```javascript
import { Router, makeEndpoint } from 'apinion';

const router = new Router();
const endpoint = {
  config: { required: ['secret'] },
  callback: ({ required }) => {
    return 'your secret is ' + required.secret;
  }
};

const anotherEndpoint = makeEndpoint({ name: 'test' }, () => {
  return [1, 2, 3];
});

const routeArray = [
  { path: 'v1', subrouter: [
    { path: '/some_secret', get: endpoint },
    { path: '/inline', any: { config: { name: 'hi' }, callback: () => 'inline created' } },
  ]},
  { path: '/test', get: anotherEndpoint },
];

router.applyRoutes(routeArray);
```
now you can hit `yourapi/v1/some_secret?secret=hi` and `yourapi/test`

### promises
* promises are accepted as endpoint callbacks

```javascript
import { Router } from 'apinion';

const router = new Router();

router.post('/async', {}, () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('this took a second'), 1000);
  });
});

router.listen(4495);
```

## authentication
* You can require authentication functions on a subrouter or on individual endpoints

#### subrouter authentication:
```javascript
import { Router, HttpError } from 'apinion';

const router = new Router();
const adminSubrouter = router.subrouter('/admin');
const users = {
  jerry: { username: 'jerry', password: 'friar', admin: true },
  bob: { username: 'bob', password: 'friar', admin: false },
};

adminSubrouter.setAuthenticator(({ request, body, query, headers }) => {
  const usable = body || query;
  const user = users[usable?.username];
  if (!user || user?.password !== usable?.password) {
    throw new HttpError({ status: 401, message: 'Bad creds' });
  }
  if (!user?.admin) {
    throw new HttpError({ status: 403, message: 'Not allowed' });
  }
  return user;
});

adminSubrouter.get('/hi', { name: 'super secret admin thing', secret: true }, ({ identity, body }) => {
  return { identity, body };
});

router.listen(10583);
```

#### endpoint authentication:
```javascript
import { Router, makeHardcodedBasicAuthenticator } from 'apinion';

const router = new Router();
const tempAuthenticator = makeHardcodedBasicAuthenticator([{ username: 'joe', password: 'doe' }]);

router.get('/auth', { authenticator: tempAuthenticator }, ({ identity }) => {
  return identity;
});

router.listen(5550);
```


## streaming post body
* use `noParse` to prevent the input from being automatically parsed, in this mode the body parameter is guaranteed to be undefined

```javascript
import { Router, makeHardcodedBasicAuthenticator } from 'apinion';
import fs from 'fs';

const router = new Router();

router.get('/streamable', { noParse: true }, ({ request }) => {
  const destination = fs.createWriteStream('filename.ext');
  request.pipe(destination);
  return new Promise(resolve => {
    destination.on('finish', () => {
      resolve({ message: 'wrote file', filename: 'filename.ext' });
    });
  });
});

router.listen(5550);
```

## combined parameters and custom request auth:
```javascript
import { Router, makeRequestAuthenticator } from 'apinion';

const router = new Router();
const tempAuthenticator = makeRequestAuthenticator((input) => {
  if (input?.headers?.secret === 'fancypants') return { admin: true };

  return null;
});

router.get('/paramtest', { authenticator: tempAuthenticator, required: ['a', 'b'], optional: ['c'] }, ({ identity, params }) => {
  if (identity?.admin) {
    return params.a + params.b + params.c;
  } else {
    return params.a;
  }
});

router.listen(5550);
```

##  makeEndpoint:
```javascript
import { Router, makeEndpoint } from 'apinion';

const router = new Router();

const customEndpoint = makeEndpoint({ name: 'custom', required: ['z'] }, async (params) => {
  return { something: 'another' };
});

const customEndpoint2 = makeEndpoint({ name: 'custom2' }, async (params) => {
  return { message: 'hola' };
});

const customEndpoint3 = makeEndpoint({ name: 'custom3' }, async (params) => {
  return { action: 'do the thing' };
});

const routes = [
  {
    path: 'v1',
    subrouter: [
      { path: 'test', get: customEndpoint },
      { path: 'test2', post: customEndpoint2 },
      { path: 'test3', any: customEndpoint3 },
    ],
  }
];

router.applyRoutes(routes);

router.listen(5550);

// now you can request http://yourapi.com/v1/test?z=test
```

## custom error handling
```javascript
import { Router, makeEndpoint } from 'apinion';

const router = new Router();
router.addErrorHandler(({ error, config, request, response }) => {
  console.error('error handling', request.originalUrl, error);

  if (error?.status) {
    response.status(error.status).send({ message: error.message || 'unknown error' });
  } else {
    // error appears to not be an apinion HttpError
    response.status(500).send({ message: 'this is a custom error' });
  }

  // if you want to bubble to parent router
  // router.parent.onError({ error, config, request, response });
});

router.listen(5550);
```

## logging
```javascript
import { Router, makeEndpoint } from 'apinion';

const router = new Router();

// request start
router.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, 'from', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  next();
});

// request end
router.addResponseCallback(({ request, response, status }) => {
  console.log(new Date().toISOString(), req.method, req.url, 'from', req.headers['x-forwarded-for'] || req.connection.remoteAddress, status);
});

// request early termination (will not be seen in request end)
router.addEarlyDisconnectCallback(({ request, response, status }) => {
  console.log(new Date().toISOString(), 'EARLY TERMINATION', req.method, req.url, 'from', req.headers['x-forwarded-for'] || req.connection.remoteAddress, status);
});


router.listen(5550);
```

## Handling websocket upgrade requests

We recommend installing the 'ws' package to help handle the specifics, here's how you integrate that package:

### For one specific endpoint

Keep in mind expressjs does not provide an upgrade verb, this work is fairly rickety and while it works for some use cases it definitely will not work for every use case. For a more generally acceptable solution you can use the global upgrade example below.

```javascript
import { Router, makeHardcodedBasicAuthenticator } from 'apinion';
import { WebSocketServer } from 'ws';

const router = new Router();

const sockAuth = makeHardcodedBasicAuthenticator([{ username: 'somebody', password: 'withapass' }]);

router.upgrade('/sockme', { authenticator: sockAuth }, ({ request, response, head, identity, socket }) =>  {
  const websockServer = new WebSocketServer({ noServer: true });

  websockServer.handleUpgrade(request, socket, head, (ws) => {
    console.log(identity.username, 'Client connected');

    ws.on('message', (message) => {
    console.log(identity.username, 'Client message', message);
      ws.send(`echo: ${message}`, { mask: true });
    });

    ws.on('close', () => {
      console.log(identity.username, 'Client disconnected');
    });
  });
});

```

### For the whole server

```javascript
import { WebSocketServer } from 'ws';
import { Router } from 'apinion';

const router = new Router();

router.globalUpgrade((request, socket, head) => {
  // perform your authentication here, keep in mind you have no express response available, so you will have to manually create a response and send it via socket.write
  const authData = { client_id: 123 };

  const websockServer = new WebSocketServer({ noServer: true });
  websockServer.handleUpgrade(request, socket, head, (ws) => {
    ws.on('message', (message) => {
      console.log(authData.client_id, 'received: %s', message);
    });

    ws.on('close', () => {
      console.log(authData.client_id, 'Client disconnected');
    });
  });
});

router.listen(5550);
```

## Accessing the express app and http server

```javascript
import { Router } from 'apinion';

const router = new Router();

const expressApp = router.expressApp();

expressApp.get('/express', (req, res) => {
  res.send('this is a route attached directly through expressjs instead of through an apinion helper');
});

expressApp.listen(5550);

const httpServer = expressApp.connection; // only available after .listen()
httpServer.on('listening', () => {
  console.log('http server is listening');
});
```

# Troubleshooting

## I'm getting an error about experimental modules

You need to run node with the `--experimental-modules` flag, or add `"type": "module"` to your package.json.

```bash
node --experimental-modules index.mjs
```
