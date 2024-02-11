/**
 * Create an api endpoint object, add to your router with methods like router.get, router.post, etc.
 * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
 * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} executionFunction
 * @returns {{ config: any, callback: any }}
 */
export function makeEndpoint(config, executionFunction) {
  return {
    config,
    callback: executionFunction,
  };
}
