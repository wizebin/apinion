import express from 'express';
import stream from 'stream';
import { joinWithSingle } from './utilities/joinWithSingle';
import { responseWrapper } from './utilities/responseWrapper';
import { HttpError, applyHttpError } from './utilities/HttpError';
import { wsRequest, wsResponse } from './utilities/websock';
import { parseQueryParamsFromUrl } from './utilities/parseQueryParams';

export class Router {
  /**
   * @param {express} app
   * @param {Router} parent
   * @param {string} baseDirectory
   */
  constructor(expressApp, parent, baseDirectory) {

    /**
     * @type {Router}
     * @public
     * @readonly
     * @description The parent router
    **/
    this.parent = parent;
    /**
     * Express application
     * @type {express.Express}
     * @public
     */
    this.app = expressApp || express();
    this.baseDirectory = baseDirectory;
    this.routes = {};
    this.upgradeRoutes = [];
    this.upgradeFunctions = [];
    this.destroyUnmatchedSocketRequests = true;
  }

  /**
   * When an uncaught error is thrown, or an promise is rejected and unhandled, this function will be called. If you want to respond with a custom error you can do so here, we recommend passing through any HttpErrors using something like
   * if (error instanceof HttpError) return response.status(error.status).send(error.message)
   * This is where you want to setup logging, generally 500 errors at least should be logged
   * @param {function({ error: Error, config: Object, request: express.Request, response: express.Response }):null} callback
   */
  addErrorHandler = (callback) => {
    this.onErrorCallback = callback;
  }

  handleResponseCallback = (req, res) => {
    if (this.onResponseCallback) {
      this.onResponseCallback(req, res);
    }
  }

  handleEarlyDisconnect = (req, res) => {
    if (this.onEarlyDisconnectCallback) {
      this.onEarlyDisconnectCallback(req, res);
    }
  }

  /**
   * Add a response callback after a request has generated a response, typically used for logging
   * @param {function({ request: express.Request, response: express.Response, status: int }):void} callback
   */
  addResponseCallback = (callback) => {
    if (!this.onResponseCallback) {
      // only add the middleware once, it will call the callback using our class handleResponseCallback method

      this.responseMiddleFunc = (req, res, next) => {
        res.on('finish', () => {
          this.handleResponseCallback({ request: req, response: res, status: res.statusCode });
        });
        next();
      };

      this.app.use(this.responseMiddleFunc);
    }

    this.onResponseCallback = callback;
  }

  /**
   * Add a response callback in the event that a user disconnects before the response is sent
   * @param {function({ request: express.Request, response: express.Response }):void} callback
   */
  addEarlyDisconnectCallback = (callback) => {
    if (!this.onEarlyDisconnectCallback) {
      // only add the middleware once, it will call the callback using our class handleEarlyDisconnect method

      this.earlyDisconnectMiddleFunc = (req, res, next) => {
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
  }

  onError = (...params) => {
    if (this.onErrorCallback) {
      return this.onErrorCallback(...params);
    } else {
      this.parent?.onError(...params);
    }
  }

  handle404 = async (request, response) => {
    await this.onError?.({ error: new HttpError({ status: 404, message: 'No Matching Route', data: { fallthrough: true } }), request, response });

    if (!response._headerSent) {
      response.status(404).send('Not Found');
    }
  }

  setAuthenticator = (authenticator) => {
    this.authenticator = authenticator;
  }

  getRoutes = () => {
    const result = {};

    const keyList = Object.keys(this.routes);

    for (let key of keyList) {
      const info = Object.assign({}, this.routes[key]);
      if (info.subrouter) {
        info.subrouter = info.subrouter.getRoutes?.();
      }
      result[key] = info;
    }

    return result;
  }

  getCleanedSubPath = (path) => {
    const subPath = this.getSubPath(path);
    if (subPath.length > 0 && subPath[0] !== '/') return '/' + subPath; // http://server.comFIX => http://server.com/FIX

    return subPath;
  }

  getSubPath = (path) => {
    if (!this.baseDirectory) return path;
    if (path === '/') return this.baseDirectory;
    return joinWithSingle([this.baseDirectory, path], '/');
  }

  describeSubroute = (subdirectory, meta) => {
    if (!this.routes[subdirectory]) this.routes[subdirectory] = {};
    Object.assign(this.routes[subdirectory], meta);
  }

  subrouter = (subdirectory) => {
    const subRouter = new Router(this.app, this, this.getCleanedSubPath(subdirectory));
    subRouter.setAuthenticator(this.authenticator);
    this.describeSubroute(subdirectory, { subrouter: subRouter });
    return subRouter;
  }

  getResponseWrapper = (callback, config = {}, type) => {
    if (this.authenticator && !config.authenticator) {
      config.authenticator = this.authenticator;
    }

    return responseWrapper(callback, config, this, type);
  }

  makeRouteDetails = (type, route, config, callback) => {
    const defaultedConfig = config || {};
    const cleanedPath = this.getCleanedSubPath(route);
    if (!defaultedConfig.route) defaultedConfig.route = cleanedPath;
    this.describeSubroute(cleanedPath, { [type]: defaultedConfig });
    let params = [cleanedPath];
    if (defaultedConfig?.middleware) {
      params = params.concat(defaultedConfig.middleware)
    }
    params.push(this.getResponseWrapper(callback, defaultedConfig, type));
    return params;
  }

  /**
   * Add a route that responds to GET requests, body will never be filled
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  get = (route, config, callback) => {
    return this.app.get(...this.makeRouteDetails('get', route, config, callback));
  }

  /**
   * Add a route that responds to POST requests, body will never be filled
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  post = (route, config, callback) => {
    return this.app.post(...this.makeRouteDetails('post', route, config, callback));
  }

  /**
   * Add a route that responds to PUT requests
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  put = (route, config, callback) => {
    return this.app.put(...this.makeRouteDetails('put', route, config, callback));
  }

  /**
   * Add a route that responds to PATCH requests
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  patch = (route, config, callback) => {
    return this.app.patch(...this.makeRouteDetails('patch', route, config, callback));
  }

  /**
   * Add a route that responds to DELETE requests
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  delete = (route, config, callback) => {
    return this.app.delete(...this.makeRouteDetails('delete', route, config, callback));
  }

  /**
   * Add a route that responds to OPTIONS requests, if you run enableCors this will be handled automatically
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  options = (route, config, callback) => {
    return this.app.options(...this.makeRouteDetails('options', route, config, callback));
  }

  /**
   * Upgrade routes are a bit different than normal verb endpoints, this is meant to consume a websocket upgrade request, unfortunately due to some constraints with expressjs there is no way to directly attach an upgrade handler like normal so we have to consume the upgrade event and pass it to this callback, that means our route is a bit less flexible than normal and subrouters aren't easily supported
   * In your callback the request and response types will not be expressjs request and response, but rather apinion.wsRequest and apinion.wsResponse
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: wsRequest, response: wsResponse, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  upgrade = (route, config, callback) => {
    config = config || {};
    config.noParse = true; // must have noParse to avoid piping the socket
    const routeDetails = this.makeRouteDetails('upgrade', route, config, callback);
    this.propagateUpgradeToRootRouter(routeDetails[0], routeDetails[routeDetails.length - 1]);
  }

  propagateUpgradeToRootRouter = (fullRoute, callback) => {
    if (this.parent) {
      this.parent.propagateUpgradeToRootRouter(fullRoute, callback);
    } else {
      this.upgradeRoutes.push([fullRoute, callback]);
      this.globalUpgrade(this.handleInternalUpgrade); // deduplicates
    }
  }

  handleInternalUpgrade = (request, socket, head) => {
    const { url } = request;

    for (let upgradeDetails of this.upgradeRoutes) {
      let route = upgradeDetails[0];
      // ignoring middleware second parameter, which is normally sent to app.get app.post, etc as the second parameter optionally
      let callback = upgradeDetails[upgradeDetails.length - 1];

      if (url.match(route)) {
        const innerRequest = new wsRequest();
        Object.assign(innerRequest, request);
        innerRequest.originalUrl = url;
        innerRequest.query = parseQueryParamsFromUrl(url);

        const innerResponse = new wsResponse(request, socket, { highWaterMark: socket.writableHighWaterMark, rejectNonStandardBodyWrites: false, keepAliveTimeout: 0, maxRequestsPerSocket: 0, shouldKeepAlive: true });

        callback(innerRequest, innerResponse, { socket, head });

        return;
      }
    }

    if (this.destroyUnmatchedSocketRequests) {
      socket.destroy();
    }
  }

  /**
   * Add a route that responds to ANY requests, GET, POST, PUT, PATCH, DELETE, OPTIONS
   * create your authenticator with one of the maxXXXAuthenticator functions, or create a custom function throwing an HttpError or returning an identity
   * @param {string|RegExp} route
   * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
   * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} callback
   */
  any = (route, config, callback) => {
    const params = this.makeRouteDetails('any', route, config, callback);

    return [
      this.app.get(...params),
      this.app.put(...params),
      this.app.post(...params),
      this.app.patch(...params),
      this.app.delete(...params),
      this.app.options(...params),
    ];
  }

  /**
   * @param {express.RequestHandler} func
   * @param  {...any} passthrough
   */
  use = (func, ...passthrough) => {
    this.app.use(func, ...passthrough);
  }

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
  globalUpgrade = (func) => {
    if (this.upgradeFunctions.indexOf(func) === -1) {
      this.upgradeFunctions.push(func);

      if (this.connection) {
        this.attachUpgradeFunction(func);
      }
    }
  }

  attachUpgradeFunction = (func) => {
    if (this.connection) {
      this.connection.on('upgrade', func);
    }
  }

  detachUpgradeFunction = (func) => {
    if (this.connection) {
      this.connection.off('upgrade', func);
    }

    const index = this.upgradeFunctions.indexOf(func);
    if (index > -1) {
      this.upgradeFunctions.splice(index, 1);
    }
  }

  applyConnectionHandlers = () => {
    if (this.upgradeFunctions?.length) {
      for (let func of this.upgradeFunctions) {
        this.attachUpgradeFunction(func);
      }
    }
  }

  /**
   * @param {Array.<{ path, executor, get, options, delete: deleteRoute, patch, post, put, subrouter, any }>} routes
   */
  applyRoutes = (routes) => {
    if (Array.isArray && !Array.isArray(routes)) {
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
  }

  /**
   * @returns {express.Express}
   */
  expressApp() {
    return this.app;
  }
  enableCors = (origin = '*', headers = 'Origin, X-Requested-With, Content-Type, Accept, Authorization', allowedMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS') => {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Headers', headers);
      res.header('Access-Control-Allow-Methods', allowedMethods);
      next();
    });
    this.app.options('*', (request, result) => result.status(200).send());
  }
  close = () => {
    if (this.connection) {
      this.connection.close();
    }
  }
  listen = (port, callback) => {
    return new Promise((resolve, reject) => {
      this.connection = this.app.listen(port, (results) => {
        console.log('listening on port', port);
        callback?.(results);
        this.app.removeListener('error', reject)
        resolve(results);
      });
      this.app.use((request, response, next) => {
        this.handle404(request, response);
      });
      this.app.once('error', reject);
      this.connection.keepAliveTimeout = 60 * 1000;
      this.connection.headersTimeout = 61 * 1000;
      this.applyConnectionHandlers();
    });
  }
}
