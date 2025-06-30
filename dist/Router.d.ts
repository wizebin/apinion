import express, { Request, Response, RequestHandler } from 'express';
import stream from 'stream';
import { wsRequest, wsResponse } from './utilities/websock';
export interface RouteConfig {
    required?: string[];
    hidden_required?: string[];
    authenticator?: (params: {
        request: Request;
        response: Response;
        body: any;
        query: any;
        headers: any;
        params: any;
    }) => any;
    noParse?: boolean;
    onError?: (params: {
        request: Request;
        response: Response;
        error: Error;
    }) => void;
    route?: string;
    middleware?: RequestHandler[];
}
export interface RouteCallback {
    (params: {
        request: Request;
        response: Response;
        identity: any;
        body: any;
        query: any;
        headers: any;
        params: any;
    }): void | Promise<void>;
}
export interface UpgradeCallback {
    (params: {
        request: wsRequest;
        response: wsResponse;
        identity: any;
        body: any;
        query: any;
        headers: any;
        params: any;
    }): void | Promise<void>;
}
interface RouteInfo {
    get?: RouteConfig;
    post?: RouteConfig;
    put?: RouteConfig;
    patch?: RouteConfig;
    delete?: RouteConfig;
    options?: RouteConfig;
    any?: RouteConfig;
    upgrade?: RouteConfig;
    subrouter?: Router;
    [key: string]: any;
}
interface RouteDefinition {
    path: string;
    executor?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    get?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    post?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    put?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    patch?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    delete?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    options?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    any?: {
        config: RouteConfig;
        callback: RouteCallback;
    };
    upgrade?: {
        config: RouteConfig;
        callback: UpgradeCallback;
    };
    subrouter?: RouteDefinition[];
}
type UpgradeHandler = (request: any, socket: stream.Duplex, head: Buffer) => void;
export declare class Router {
    parent: Router | undefined;
    app: express.Express;
    private baseDirectory;
    private routes;
    private upgradeRoutes;
    private upgradeFunctions;
    private destroyUnmatchedSocketRequests;
    private connection?;
    private authenticator?;
    private onErrorCallback?;
    private onResponseCallback?;
    private onEarlyDisconnectCallback?;
    private responseMiddleFunc?;
    private earlyDisconnectMiddleFunc?;
    constructor(expressApp?: express.Express, parent?: Router, baseDirectory?: string);
    addErrorHandler: (callback: (params: {
        error: Error;
        config?: any;
        request: Request;
        response: Response;
    }) => void) => void;
    handleResponseCallback: (params: {
        request: Request;
        response: Response;
        status: number;
    }) => void;
    handleEarlyDisconnect: (params: {
        request: Request;
        response: Response;
        status?: number;
    }) => void;
    addResponseCallback: (callback: (params: {
        request: Request;
        response: Response;
        status: number;
    }) => void) => void;
    addEarlyDisconnectCallback: (callback: (params: {
        request: Request;
        response: Response;
    }) => void) => void;
    onError: (params: {
        error: Error;
        config?: any;
        request: Request;
        response: Response;
    }) => void;
    handle404: (request: Request, response: Response) => Promise<void>;
    setAuthenticator: (authenticator: (params: any) => any) => void;
    getRoutes: () => {
        [key: string]: RouteInfo;
    };
    getCleanedSubPath: (path: string) => string;
    getSubPath: (path: string) => string;
    describeSubroute: (subdirectory: string, meta: Partial<RouteInfo>) => void;
    subrouter: (subdirectory: string) => Router;
    getResponseWrapper: (callback: RouteCallback | UpgradeCallback, config: RouteConfig | undefined, type: string) => RequestHandler;
    makeRouteDetails: (type: string, route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback | UpgradeCallback) => any[];
    get: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    post: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    put: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    patch: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    delete: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    options: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any;
    upgrade: (route: string | RegExp, config: RouteConfig | undefined, callback: UpgradeCallback) => void;
    propagateUpgradeToRootRouter: (fullRoute: string | RegExp, callback: RequestHandler) => void;
    handleInternalUpgrade: UpgradeHandler;
    any: (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback) => any[];
    use: (func: RequestHandler, ...passthrough: any[]) => void;
    globalUpgrade: (func: UpgradeHandler) => void;
    attachUpgradeFunction: (func: UpgradeHandler) => void;
    detachUpgradeFunction: (func: UpgradeHandler) => void;
    applyConnectionHandlers: () => void;
    applyRoutes: (routes: RouteDefinition | RouteDefinition[]) => void;
    expressApp(): express.Express;
    enableCors: (origin?: string, headers?: string, allowedMethods?: string) => void;
    close: () => void;
    listen: (port: number, callback?: (results?: any) => void) => Promise<any>;
}
export {};
//# sourceMappingURL=Router.d.ts.map