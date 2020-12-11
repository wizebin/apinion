import { HttpError } from '../utilities/HttpError';

export function makeBearerTokenAuthenticator(getUserFromBearerFunction) {
  return async ({ headers }) => {
    if (!headers.authorization) {
      throw new HttpError({ status: 401, message: 'Missing Authentication' });
    }

    if (headers.authorization.toLowerCase().indexOf('bearer') !== 0) {
      throw new HttpError({ status: 405, message: 'Incorrect Authentication' });
    }

    const token = headers.authorization.replace(/^bearer\s+/gi, '');

    const identity = await getUserFromBearerFunction(token);
    if (!identity) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return identity;
  }
}
