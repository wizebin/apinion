export function collectBody(request: any): Promise<any>;
/**
 * Gather required input parameters for an authenticator body, useful for implementing auth in websocket upgrade requests
 * @param {{ request: Express.Request, response: Express.Response }} requestDetails
 * @returns {Promise<{ request: Express.Request, response: Express.Response, body: object, query: object, headers: object, params: object }>}
 */
export function gatherAuthParams({ request, response, config }: {
    request: Express.Request;
    response: Express.Response;
}): Promise<{
    request: Express.Request;
    response: Express.Response;
    body: object;
    query: object;
    headers: object;
    params: object;
}>;
/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func: Function, config: {
    authenticator: Function;
}, apinionRouter: any): (request: any, response: any) => Promise<void>;
