import { HttpError } from '../utilities/HttpError';

/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * @param {[{ username: string, password: string }]} users
 */
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

export function makeBasicAuthenticator(getUserFromCredentialsFunction) {
  return async ({ headers }) => {
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
    const username = decoded.substr(0, colonPosition);
    const password = decoded.substr(colonPosition + 1);

    const user = await getUserFromCredentialsFunction({ username, password });
    console.log({ auth, encoded, decoded, colonPosition, username, password, user })

    if (!user) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return user;
  }
}
