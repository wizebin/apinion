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
    getResponseWrapper: (callback: any, config?: {}) => (request: any, response: any) => Promise<void>;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
            request;
            response;
            error;
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
     * @param {Array.<{ path, executor, get, options, delete: deleteRoute, patch, post, put, subrouter, any }>} routes
     */
    applyRoutes: (routes: Array<{
        path;
        executor;
        get;
        options;
        delete: deleteRoute;
        patch;
        post;
        put;
        subrouter;
        any;
    }>) => void;
    /**
     * @returns {express.Express}
     */
    expressApp(): express.Express;
    enableCors: (origin?: string, headers?: string) => void;
    close: () => void;
    listen: (port: any, callback: any) => Promise<any>;
    connection: any;
}
