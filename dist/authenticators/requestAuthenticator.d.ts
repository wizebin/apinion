import { AuthConfig, AuthenticatorFunction } from './basicAuthenticator';
export type GetUserFromRequestFunction = (params: AuthConfig) => Promise<any> | any;
export declare function makeRequestAuthenticator(getUserFromRequest: GetUserFromRequestFunction): AuthenticatorFunction;
//# sourceMappingURL=requestAuthenticator.d.ts.map