import { HttpError } from '../utilities/HttpError';

// Import shared types from basicAuthenticator
import { AuthConfig, AuthenticatorFunction } from './basicAuthenticator';

export type GetUserFromRequestFunction = (
  params: AuthConfig
) => Promise<any> | any;

/**
 * Create an authenticator to be used in your endpoints, this authenticator can be async and should return the identity you want to use in your endpoint. identity is passed as a part of the object to your endpoint handler
 */
export function makeRequestAuthenticator(
  getUserFromRequest: GetUserFromRequestFunction
): AuthenticatorFunction {
  return async (params: AuthConfig) => {
    const identity = await getUserFromRequest(params);
    if (!identity) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return identity;
  }
}