/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * we recommend strongly that you do not use this, we provide this as an early development tool but you should use a request authenticator or a bearer token authenticator
 * @param {Array.<{ username: string, password: string }>} users
 * @returns function
 **/
export function makeHardcodedBasicAuthenticator(users: Array<{
    username: string;
    password: string;
}>): (config: any) => Promise<any>;
/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * This function handles base64 decoding and splitting the username and password
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 * @param {function({ username: string, password: string }, { request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromCredentials
 * @returns function
 */
export function makeBasicAuthenticator(getUserFromCredentials: (arg0: {
    username: string;
    password: string;
}, arg1: {
    request: express.Request;
    response: express.Response;
    body: object;
    query: object;
    headers: object;
    params: object;
}) => any): (config: any) => Promise<any>;
