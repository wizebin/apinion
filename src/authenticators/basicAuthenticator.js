import { HttpError } from '../utilities/HttpError';

/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * we recommend strongly that you do not use this, we provide this as an early development tool but you should use a request authenticator or a bearer token authenticator
 * @param {Array.<{ username: string, password: string }>} users
 * @returns function
 **/
export function makeHardcodedBasicAuthenticator(users) {
  const usersByUsername = {};
  for (let user of users) {
    usersByUsername[user.username] = user;
  }

  const getUser = ({ username, password }) => {
    const user = usersByUsername[username];
    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  return makeBasicAuthenticator(getUser);
}

/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * This function handles base64 decoding and splitting the username and password
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 * @param {function({ username: string, password: string }, { request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromCredentials
 * @returns function
 */
export function makeBasicAuthenticator(getUserFromCredentials) {
  return async (config) => {
    const { headers } = config;

    if (!headers.authorization) {
      console.log(headers);
      throw new HttpError({ status: 401, message: 'Missing Authentication' });
    }

    if (headers.authorization.toLowerCase().indexOf('basic') !== 0) {
      throw new HttpError({ status: 405, message: 'Incorrect Authentication' });
    }

    const auth = headers.authorization.replace(/^basic\s+/gi, '');
    const encoded = Buffer.from(auth, 'base64');
    const decoded = encoded.toString('utf-8');
    const colonPosition = decoded.indexOf(':');
    const username = decoded.substring(0, colonPosition);
    const password = decoded.substring(colonPosition + 1);

    const user = await getUserFromCredentials({ username, password }, config);

    if (!user) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return user;
  }
}
