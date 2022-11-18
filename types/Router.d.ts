export class Router {
    /**
     * @param {express} expressApp
     * @param {Router} parent
     * @param {string} baseDirectory
     */
    constructor(expressApp: express, parent: Router, baseDirectory: string);
    parent: Router;
    expressApp(): () => any;
    baseDirectory: string;
    routes: {};
    setAuthenticator: (authenticator: any) => void;
    authenticator: any;
    getRoutes: () => {};
    getCleanedSubPath: (path: any) => any;
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
    listen: (port: any, callback: any) => Promise<any>;
    connection: any;
}
