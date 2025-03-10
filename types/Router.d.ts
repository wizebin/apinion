export class Router {
    /**
     * @param {express} app
     * @param {Router} parent
     * @param {string} baseDirectory
     */
    constructor(expressApp: any, parent: Router, baseDirectory: string);
    /**
     * @type {Router}
     * @public
     * @readonly
     * @description The parent router
    **/
    public readonly parent: Router;
    /**
     * Express application
     * @type {express.Express}
     * @public
     */
    public app: express.Express;
    baseDirectory: string;
    routes: {};
    upgradeRoutes: any[];
    upgradeFunctions: any[];
    destroyUnmatchedSocketRequests: boolean;
    /**
     * When an uncaught error is thrown, or an promise is rejected and unhandled, this function will be called. If you want to respond with a custom error you can do so here, we recommend passing through any HttpErrors using something like
     * if (error instanceof HttpError) return response.status(error.status).send(error.message)
     * This is where you want to setup logging, generally 500 errors at least should be logged
     * @param {function({ error: Error, config: Object, request: express.Request, response: express.Response }):null} callback
     */
    addErrorHandler: (callback: (arg0: {
        error: Error;
        config: any;
        request: express.Request;
        response: express.Response;
    }) => null) => void;
    onErrorCallback: (arg0: {
        error: Error;
        config: any;
        request: express.Request;
        response: express.Response;
    }) => null;
    handleResponseCallback: (req: any, res: any) => void;
    handleEarlyDisconnect: (req: any, res: any) => void;
    /**
     * Add a response callback after a request has generated a response, typically used for logging
     * @param {function({ request: express.Request, response: express.Response, status: int }):void} callback
     */
    addResponseCallback: (callback: (arg0: {
        request: express.Request;
        response: express.Response;
        status: int;
    }) => void) => void;
    responseMiddleFunc: (req: any, res: any, next: any) => void;
    onResponseCallback: (arg0: {
        request: express.Request;
        response: express.Response;
        status: int;
    }) => void;
    /**
     * Add a response callback in the event that a user disconnects before the response is sent
     * @param {function({ request: express.Request, response: express.Response }):void} callback
     */
    addEarlyDisconnectCallback: (callback: (arg0: {
        request: express.Request;
        response: express.Response;
    }) => void) => void;
    earlyDisconnectMiddleFunc: (req: any, res: any, next: any) => void;
    onEarlyDisconnectCallback: (arg0: {
        request: express.Request;
        response: express.Response;
    }) => void;
    onError: (...params: any[]) => null;
    handle404: (request: any, response: any) => Promise<void>;
    setAuthenticator: (authenticator: any) => void;
    authenticator: any;
    getRoutes: () => {};
    getCleanedSubPath: (path: any) => any;
    getSubPath: (path: any) => any;
    describeSubroute: (subdirectory: any, meta: any) => void;
    subrouter: (subdirectory: any) => Router;
    getResponseWrapper: (callback: any, config: {}, type: any) => (request: any, response: any, extras: any) => Promise<void>;
    makeRouteDetails: (type: any, route: any, config: any, callback: any) => any[];
    /**
     * Add a route that responds to GET requests, body will never be filled
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    get: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Add a route that responds to POST requests, body will never be filled
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    post: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Add a route that responds to PUT requests
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    put: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Add a route that responds to PATCH requests
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    patch: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Add a route that responds to DELETE requests
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    delete: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Add a route that responds to OPTIONS requests, if you run enableCors this will be handled automatically
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    options: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any;
    /**
     * Upgrade routes are a bit different than normal verb endpoints, this is meant to consume a websocket upgrade request, unfortunately due to some constraints with expressjs there is no way to directly attach an upgrade handler like normal so we have to consume the upgrade event and pass it to this callback, that means our route is a bit less flexible than normal and subrouters aren't easily supported
     * In your callback the request and response types will not be expressjs request and response, but rather apinion.wsRequest and apinion.wsResponse
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: wsRequest, response: wsResponse, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    upgrade: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: wsRequest;
        response: wsResponse;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => void;
    propagateUpgradeToRootRouter: (fullRoute: any, callback: any) => void;
    handleInternalUpgrade: (request: any, socket: any, head: any) => void;
    /**
     * Add a route that responds to ANY requests, GET, POST, PUT, PATCH, DELETE, OPTIONS
     * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
     * @param {string|RegExp} route
     * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
     * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
     */
    any: (route: string | RegExp, config: {
        required: string[] | null;
        hidden_required: string[] | null;
        authenticator: (arg0: {
            request: express.Request;
            response: express.Response;
            body: object;
            query: object;
            headers: object;
            params: object;
        }) => any;
        noParse: boolean | null;
        onError: (arg0: {
            request: any;
            response: any;
            error: any;
        }) => null;
    }, callback: (arg0: {
        request: express.Request;
        response: express.Response;
        identity: any;
        body: object;
        query: object;
        headers: object;
        params: object;
    }) => void) => any[];
    /**
     * @param {express.RequestHandler} func
     * @param  {...any} passthrough
     */
    use: (func: express.RequestHandler, ...passthrough: any[]) => void;
    /**
      * A callback used to handle upgrade requests, this is a global event instead of an event attached to a given endpoint
      * @callback upgradeCallback
      * @param {express.Request} request - The express request
      * @param {stream.Duplex} socket - The tcp socket
      * @param {Buffer} head
     */
    /**
     * @param {upgradeCallback} callback
     */
    globalUpgrade: (func: any) => void;
    attachUpgradeFunction: (func: any) => void;
    detachUpgradeFunction: (func: any) => void;
    applyConnectionHandlers: () => void;
    /**
     * @param {Array.<{ path, executor, get, options, delete: deleteRoute, patch, post, put, subrouter, any }>} routes
     */
    applyRoutes: (routes: Array<{
        path: any;
        executor: any;
        get: any;
        options: any;
        delete: deleteRoute;
        patch: any;
        post: any;
        put: any;
        subrouter: any;
        any: any;
    }>) => void;
    /**
     * @returns {express.Express}
     */
    expressApp(): express.Express;
    enableCors: (origin?: string, headers?: string, allowedMethods?: string) => void;
    close: () => void;
    listen: (port: any, callback: any) => Promise<any>;
    connection: any;
}
import { wsRequest } from './utilities/websock';
import { wsResponse } from './utilities/websock';
