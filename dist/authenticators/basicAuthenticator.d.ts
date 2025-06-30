import { Request, Response } from 'express';
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
    [key: string]: any;
}
export type GetUserFromCredentialsFunction = (credentials: BasicCredentials, config: AuthConfig) => Promise<any> | any;
export type AuthenticatorFunction = (config: AuthConfig) => Promise<any>;
export declare function makeHardcodedBasicAuthenticator(users: BasicUser[]): AuthenticatorFunction;
export declare function makeBasicAuthenticator(getUserFromCredentials: GetUserFromCredentialsFunction): AuthenticatorFunction;
//# sourceMappingURL=basicAuthenticator.d.ts.map