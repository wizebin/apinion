import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Server } from 'http';
import stream from 'stream';
import { Socket } from 'net';
import { joinWithSingle } from './utilities/joinWithSingle';
import { responseWrapper } from './utilities/responseWrapper';
import { HttpError } from './utilities/HttpError';
import { wsRequest, wsResponse } from './utilities/websock';
import { parseQueryParamsFromUrl } from './utilities/parseQueryParams';

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
  onError?: (params: { request: Request; response: Response; error: Error }) => void;
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
  executor?: { config: RouteConfig; callback: RouteCallback };
  get?: { config: RouteConfig; callback: RouteCallback };
  post?: { config: RouteConfig; callback: RouteCallback };
  put?: { config: RouteConfig; callback: RouteCallback };
  patch?: { config: RouteConfig; callback: RouteCallback };
  delete?: { config: RouteConfig; callback: RouteCallback };
  options?: { config: RouteConfig; callback: RouteCallback };
  any?: { config: RouteConfig; callback: RouteCallback };
  upgrade?: { config: RouteConfig; callback: UpgradeCallback };
  subrouter?: RouteDefinition[];
}

type UpgradeHandler = (request: any, socket: stream.Duplex, head: Buffer) => void;

export class Router {
  public parent: Router | undefined;
  public app: express.Express;
  private baseDirectory: string;
  private routes: { [key: string]: RouteInfo };
  private upgradeRoutes: Array<[string, RequestHandler]>;
  private upgradeFunctions: UpgradeHandler[];
  private destroyUnmatchedSocketRequests: boolean;
  private connection?: Server;
  private authenticator?: (params: any) => any;
  private onErrorCallback?: (params: {
    error: Error;
    config?: any;
    request: Request;
    response: Response;
  }) => void;
  private onResponseCallback?: (params: {
    request: Request;
    response: Response;
    status: number;
  }) => void;
  private onEarlyDisconnectCallback?: (params: {
    request: Request;
    response: Response;
    status?: number;
  }) => void;
  private responseMiddleFunc?: RequestHandler;
  private earlyDisconnectMiddleFunc?: RequestHandler;

  constructor(expressApp?: express.Express, parent?: Router, baseDirectory?: string) {
    this.parent = parent;
    this.app = expressApp || express();
    this.baseDirectory = baseDirectory || '';
    this.routes = {};
    this.upgradeRoutes = [];
    this.upgradeFunctions = [];
    this.destroyUnmatchedSocketRequests = true;
  }

  addErrorHandler = (
    callback: (params: {
      error: Error;
      config?: any;
      request: Request;
      response: Response;
    }) => void
  ): void => {
    this.onErrorCallback = callback;
  };

  handleResponseCallback = (params: { request: Request; response: Response; status: number }): void => {
    if (this.onResponseCallback) {
      this.onResponseCallback(params);
    }
  };

  handleEarlyDisconnect = (params: { request: Request; response: Response; status?: number }): void => {
    if (this.onEarlyDisconnectCallback) {
      this.onEarlyDisconnectCallback(params);
    }
  };

  addResponseCallback = (
    callback: (params: {
      request: Request;
      response: Response;
      status: number;
    }) => void
  ): void => {
    if (!this.onResponseCallback) {
      this.responseMiddleFunc = (req: Request, res: Response, next: NextFunction) => {
        res.on('finish', () => {
          this.handleResponseCallback({ request: req, response: res, status: res.statusCode });
        });
        next();
      };

      this.app.use(this.responseMiddleFunc);
    }

    this.onResponseCallback = callback;
  };

  addEarlyDisconnectCallback = (
    callback: (params: {
      request: Request;
      response: Response;
    }) => void
  ): void => {
    if (!this.onEarlyDisconnectCallback) {
      this.earlyDisconnectMiddleFunc = (req: Request, res: Response, next: NextFunction) => {
        res.on('close', () => {
          if (!res.headersSent) {
            this.handleEarlyDisconnect({ request: req, response: res, status: res.statusCode });
          }
        });
        next();
      };

      this.app.use(this.earlyDisconnectMiddleFunc);
    }

    this.onEarlyDisconnectCallback = callback;
  };

  onError = (params: { error: Error; config?: any; request: Request; response: Response }): void => {
    if (this.onErrorCallback) {
      return this.onErrorCallback(params);
    } else {
      this.parent?.onError(params);
    }
  };

  handle404 = async (request: Request, response: Response): Promise<void> => {
    if (this.onError) {
      this.onError({
        error: new HttpError({ status: 404, message: 'No Matching Route', data: { fallthrough: true } }),
        request,
        response
      });
    }

    if (!(response as any)._headerSent) {
      response.status(404).send('Not Found');
    }
  };

  setAuthenticator = (authenticator: (params: any) => any): void => {
    this.authenticator = authenticator;
  };

  getRoutes = (): { [key: string]: RouteInfo } => {
    const result: { [key: string]: RouteInfo } = {};

    const keyList = Object.keys(this.routes);

    for (let key of keyList) {
      const info = Object.assign({}, this.routes[key]);
      if (info.subrouter) {
        info.subrouter = info.subrouter.getRoutes?.() as any;
      }
      result[key] = info;
    }

    return result;
  };

  getCleanedSubPath = (path: string): string => {
    const subPath = this.getSubPath(path);
    if (subPath.length > 0 && subPath[0] !== '/') return '/' + subPath;

    return subPath;
  };

  getSubPath = (path: string): string => {
    if (!this.baseDirectory) return path;
    if (path === '/') return this.baseDirectory;
    return joinWithSingle([this.baseDirectory, path], '/');
  };

  describeSubroute = (subdirectory: string, meta: Partial<RouteInfo>): void => {
    if (!this.routes[subdirectory]) this.routes[subdirectory] = {};
    Object.assign(this.routes[subdirectory], meta);
  };

  subrouter = (subdirectory: string): Router => {
    const subRouter = new Router(this.app, this, this.getCleanedSubPath(subdirectory));
    subRouter.setAuthenticator(this.authenticator!);
    this.describeSubroute(subdirectory, { subrouter: subRouter });
    return subRouter;
  };

  getResponseWrapper = (
    callback: RouteCallback | UpgradeCallback,
    config: RouteConfig = {},
    type: string
  ): RequestHandler => {
    if (this.authenticator && !config.authenticator) {
      config.authenticator = this.authenticator;
    }

    // Create a compatible wrapper for the callback
    const endpointConfig = {
      required: config.required,
      hidden_required: config.hidden_required,
      authenticator: config.authenticator,
      noParse: config.noParse,
      onError: config.onError ? (params: any) => { config.onError!(params); } : undefined,
      route: config.route,
    };

    const endpointExecutor = (params: any) => {
      return callback(params);
    };

    return responseWrapper(endpointExecutor, endpointConfig, this, type);
  };

  makeRouteDetails = (
    type: string,
    route: string | RegExp,
    config: RouteConfig | undefined,
    callback: RouteCallback | UpgradeCallback
  ): any[] => {
    const defaultedConfig = config || {};
    const cleanedPath = typeof route === 'string' ? this.getCleanedSubPath(route) : route;
    if (!defaultedConfig.route && typeof cleanedPath === 'string') defaultedConfig.route = cleanedPath;
    this.describeSubroute(cleanedPath as string, { [type]: defaultedConfig });
    let params: any[] = [cleanedPath];
    if (defaultedConfig?.middleware) {
      params = params.concat(defaultedConfig.middleware);
    }
    params.push(this.getResponseWrapper(callback, defaultedConfig, type));
    return params;
  };

  get = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('get', route, config, callback);
    return this.app.get(routeDetails[0], ...routeDetails.slice(1));
  };

  post = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('post', route, config, callback);
    return this.app.post(routeDetails[0], ...routeDetails.slice(1));
  };

  put = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('put', route, config, callback);
    return this.app.put(routeDetails[0], ...routeDetails.slice(1));
  };

  patch = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('patch', route, config, callback);
    return this.app.patch(routeDetails[0], ...routeDetails.slice(1));
  };

  delete = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('delete', route, config, callback);
    return this.app.delete(routeDetails[0], ...routeDetails.slice(1));
  };

  options = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any => {
    const routeDetails = this.makeRouteDetails('options', route, config, callback);
    return this.app.options(routeDetails[0], ...routeDetails.slice(1));
  };

  upgrade = (route: string | RegExp, config: RouteConfig | undefined, callback: UpgradeCallback): void => {
    config = config || {};
    config.noParse = true;
    const routeDetails = this.makeRouteDetails('upgrade', route, config, callback);
    this.propagateUpgradeToRootRouter(routeDetails[0], routeDetails[routeDetails.length - 1]);
  };

  propagateUpgradeToRootRouter = (fullRoute: string | RegExp, callback: RequestHandler): void => {
    if (this.parent) {
      this.parent.propagateUpgradeToRootRouter(fullRoute, callback);
    } else {
      this.upgradeRoutes.push([fullRoute as string, callback]);
      this.globalUpgrade(this.handleInternalUpgrade);
    }
  };

  handleInternalUpgrade: UpgradeHandler = (request: any, socket: stream.Duplex, _head: Buffer): void => {
    const { url } = request;

    for (let upgradeDetails of this.upgradeRoutes) {
      let route = upgradeDetails[0];
      let callback = upgradeDetails[upgradeDetails.length - 1];

      if (url.match(route)) {
        const innerRequest = new wsRequest();
        Object.assign(innerRequest, request);
        (innerRequest as any).originalUrl = url;
        (innerRequest as any).query = parseQueryParamsFromUrl(url);

        const innerResponse = new wsResponse(request, socket as Socket, {
          highWaterMark: socket.writableHighWaterMark,
          rejectNonStandardBodyWrites: false,
          keepAliveTimeout: 0,
          maxRequestsPerSocket: 0,
          shouldKeepAlive: true
        });

        if (typeof callback === 'function') {
          const upgradeCallback = callback as unknown as UpgradeCallback;
          upgradeCallback({
            request: innerRequest,
            response: innerResponse,
            identity: undefined,
            body: undefined,
            query: (innerRequest as any).query,
            headers: innerRequest.headers,
            params: (innerRequest as any).query || {}
          });
        }

        return;
      }
    }

    if (this.destroyUnmatchedSocketRequests) {
      socket.destroy();
    }
  };

  any = (route: string | RegExp, config: RouteConfig | undefined, callback: RouteCallback): any[] => {
    const params = this.makeRouteDetails('any', route, config, callback);

    return [
      this.app.get(params[0], ...params.slice(1)),
      this.app.put(params[0], ...params.slice(1)),
      this.app.post(params[0], ...params.slice(1)),
      this.app.patch(params[0], ...params.slice(1)),
      this.app.delete(params[0], ...params.slice(1)),
      this.app.options(params[0], ...params.slice(1)),
    ];
  };

  use = (func: RequestHandler, ...passthrough: any[]): void => {
    this.app.use(func, ...passthrough);
  };

  globalUpgrade = (func: UpgradeHandler): void => {
    if (this.upgradeFunctions.indexOf(func) === -1) {
      this.upgradeFunctions.push(func);

      if (this.connection) {
        this.attachUpgradeFunction(func);
      }
    }
  };

  attachUpgradeFunction = (func: UpgradeHandler): void => {
    if (this.connection) {
      this.connection.on('upgrade', func);
    }
  };

  detachUpgradeFunction = (func: UpgradeHandler): void => {
    if (this.connection) {
      this.connection.off('upgrade', func);
    }

    const index = this.upgradeFunctions.indexOf(func);
    if (index > -1) {
      this.upgradeFunctions.splice(index, 1);
    }
  };

  applyConnectionHandlers = (): void => {
    if (this.upgradeFunctions?.length) {
      for (let func of this.upgradeFunctions) {
        this.attachUpgradeFunction(func);
      }
    }
  };

  applyRoutes = (routes: RouteDefinition | RouteDefinition[]): void => {
    if (!Array.isArray(routes)) {
      routes = [routes];
    }

    for (let route of routes) {
      const { path, executor, get, options, delete: deleteRoute, patch, post, put, subrouter, any, upgrade } = route;

      if (executor) this.any(path, executor.config, executor.callback);
      if (any) this.any(path, any.config, any.callback);
      if (get) this.get(path, get.config, get.callback);
      if (post) this.post(path, post.config, post.callback);
      if (options) this.options(path, options.config, options.callback);
      if (patch) this.patch(path, patch.config, patch.callback);
      if (put) this.put(path, put.config, put.callback);
      if (deleteRoute) this.delete(path, deleteRoute.config, deleteRoute.callback);
      if (upgrade) this.upgrade(path, upgrade.config, upgrade.callback);
      if (subrouter) {
        const sub = this.subrouter(path);
        sub.applyRoutes(subrouter);
      }
    }
  };

  expressApp(): express.Express {
    return this.app;
  }

  enableCors = (
    origin: string = '*',
    headers: string = 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    allowedMethods: string = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  ): void => {
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Headers', headers);
      res.header('Access-Control-Allow-Methods', allowedMethods);
      next();
    });
    this.app.options('*', (_request: Request, result: Response) => {
      result.status(200).send();
    });
  };

  close = (): void => {
    if (this.connection) {
      this.connection.close();
    }
  };

  listen = (port: number, callback?: (results?: any) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.connection = this.app.listen(port, (results?: any) => {
        console.log('listening on port', port);
        callback?.(results);
        this.app.removeListener('error', reject);
        resolve(results);
      });
      this.app.use((request: Request, response: Response, _next: NextFunction) => {
        this.handle404(request, response);
      });
      this.app.once('error', reject);
      this.connection.keepAliveTimeout = 60 * 1000;
      this.connection.headersTimeout = 61 * 1000;
      this.applyConnectionHandlers();
    });
  };
}