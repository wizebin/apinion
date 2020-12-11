export class Router {
    constructor(expressApp: any, parent: any, baseDirectory: any);
    parent: any;
    expressApp(): () => any;
    baseDirectory: any;
    routes: {};
    setAuthenticator: (authenticator: any) => void;
    authenticator: any;
    getRoutes: () => {};
    getSubPath: (path: any) => any;
    describeSubroute: (subdirectory: any, meta: any) => void;
    subrouter: (subdirectory: any) => Router;
    getResponseWrapper: (callback: any, config?: {}) => (request: any, response: any) => Promise<void>;
    makeRouteDetails: (type: any, route: any, config: any, callback: any) => any[];
    get: (route: any, config: any, callback: any) => any;
    post: (route: any, config: any, callback: any) => any;
    put: (route: any, config: any, callback: any) => any;
    patch: (route: any, config: any, callback: any) => any;
    delete: (route: any, config: any, callback: any) => any;
    options: (route: any, config: any, callback: any) => any;
    any: (route: any, config: any, callback: any) => any[];
    use: (...passthrough: any[]) => void;
    applyRoutes: (routes: any) => void;
    expressConnection(): () => any;
    enableCors: (origin?: string, headers?: string) => void;
    close: () => void;
    listen: (port: any, callback: any) => void;
    connection: any;
}
