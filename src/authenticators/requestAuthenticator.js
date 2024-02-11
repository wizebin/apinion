import { HttpError } from '../utilities/HttpError';

/**
 * Create an authenticator to be used in your endpoints, this authenticator can be async and should return the identity you want to use in your endpoint. identity is passed as a part of the object to your endpoint handler
 * @param {function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromRequest
 * @returns function
 */
export function makeRequestAuthenticator(getUserFromRequest) {
  return async (params) => {
    const identity = await getUserFromRequest(params);
    if (!identity) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return identity;
  }
}
