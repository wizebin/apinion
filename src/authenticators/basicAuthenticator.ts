import { Request, Response } from 'express';
import { HttpError } from '../utilities/HttpError';

// Define types for the authenticator system
export interface AuthConfig {
  request: Request;
  response: Response;
  body: any;
  query: any;
  headers: Record<string, string>;
  params: any;
}

export interface BasicCredentials {
  username: string;
  password: string;
}

export interface BasicUser {
  username: string;
  password: string;
  [key: string]: any; // Allow additional properties
}

export type GetUserFromCredentialsFunction = (
  credentials: BasicCredentials,
  config: AuthConfig
) => Promise<any> | any;

export type AuthenticatorFunction = (config: AuthConfig) => Promise<any>;

/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * we recommend strongly that you do not use this, we provide this as an early development tool but you should use a request authenticator or a bearer token authenticator
 */
export function makeHardcodedBasicAuthenticator(users: BasicUser[]): AuthenticatorFunction {
  const usersByUsername: Record<string, BasicUser> = {};
  for (const user of users) {
    usersByUsername[user.username] = user;
  }

  const getUser = ({ username, password }: BasicCredentials): BasicUser | null => {
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
 */
export function makeBasicAuthenticator(
  getUserFromCredentials: GetUserFromCredentialsFunction
): AuthenticatorFunction {
  return async (config: AuthConfig) => {
    const { headers } = config;

    if (!headers.authorization) {
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