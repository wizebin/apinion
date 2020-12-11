import { HttpError } from '../utilities/HttpError';

export function makeRequestAuthenticator(getUserFromRequest) {
  return async (params) => {
    const identity = await getUserFromRequest(params);
    if (!identity) {
      throw new HttpError({ status: 401, message: 'Incorrect Credentials' });
    }

    return identity;
  }
}
