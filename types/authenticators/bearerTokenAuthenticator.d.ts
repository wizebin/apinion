/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 * @param {function({ token: string, config: { request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromBearerFunction
 * @returns function
 */
export function makeBearerTokenAuthenticator(getUserFromBearerFunction: (arg0: {
    token: string;
    config: {
        request: express.Request;
        response: express.Response;
        body: object;
        query: object;
        headers: object;
        params: object;
    };
}) => any): (config: any) => Promise<any>;
