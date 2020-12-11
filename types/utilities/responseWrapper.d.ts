/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func: Function, config: {
    authenticator: Function;
}): (request: any, response: any) => Promise<void>;
