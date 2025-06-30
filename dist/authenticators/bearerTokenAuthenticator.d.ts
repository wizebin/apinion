import { AuthConfig, AuthenticatorFunction } from './basicAuthenticator';
export type GetUserFromBearerFunction = (token: string, config: AuthConfig) => Promise<any> | any;
export declare function makeBearerTokenAuthenticator(getUserFromBearerFunction: GetUserFromBearerFunction): AuthenticatorFunction;
//# sourceMappingURL=bearerTokenAuthenticator.d.ts.map