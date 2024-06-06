/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func: Function, config: {
    authenticator: Function;
}, apinionRouter: any, type: any): (request: any, response: any, extras: any) => Promise<void>;
