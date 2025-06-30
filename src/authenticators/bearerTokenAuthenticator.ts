import { HttpError } from '../utilities/HttpError';

// Import shared types from basicAuthenticator
import { AuthConfig, AuthenticatorFunction } from './basicAuthenticator';

export type GetUserFromBearerFunction = (
  token: string,
  config: AuthConfig
) => Promise<any> | any;

/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 */
export function makeBearerTokenAuthenticator(
  getUserFromBearerFunction: GetUserFromBearerFunction
): AuthenticatorFunction {
  return async (config: AuthConfig) => {
    const { headers } = config;

    if (!headers.authorization) {
      throw new HttpError({ status: 401, message: 'Missing Authentication' });
    }

    if (headers.authorization.toLowerCase().indexOf('bearer') !== 0) {
      throw new HttpError({ status: 405, message: 'Incorrect Authentication' });
    }

    const token = headers.authorization.replace(/^bearer\s+/gi, '');

    const identity = await getUserFromBearerFunction(token, config);
    if (!identity) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return identity;
  }
}