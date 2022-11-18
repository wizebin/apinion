## APInion
#### an opinionated API framework built on express

* Presently this framework is not ready for production use outside of my own projects, proceed at your own risk.

## API Documentation

```javascript
import { Router } from 'apinion';

const router = new Router();

router.enableCors();

router.get('/endpoint', { name: 'name' }, () => {
  return {
    data: 'this will be returned as json to the end user';
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
