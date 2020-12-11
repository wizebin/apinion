import express from 'express';
import { joinWithSingle } from './utilities/joinWithSingle';
import { responseWrapper } from './utilities/responseWrapper';

export class Router {
  constructor(expressApp, parent, baseDirectory) {
    this.parent = parent;
    this.expressApp = expressApp || express();
    this.baseDirectory = baseDirectory;
    this.routes = {};
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
    const subRouter = new Router(this.expressApp, this, this.getSubPath(subdirectory));
    subRouter.setAuthenticator(this.authenticator);
    this.describeSubroute(subdirectory, { subrouter: subRouter });
    return subRouter;
  }

  getResponseWrapper = (callback, config = {}) => {
    if (this.authenticator && !config.authenticator) {
      config.authenticator = this.authenticator;
    }

    return responseWrapper(callback, config);
  }

  makeRouteDetails = (type, route, config, callback) => {
    this.describeSubroute(route, { [type]: config });
    let params = [this.getSubPath(route)];
    if (config?.middleware) {
      params = params.concat(config.middleware)
    }
    params.push(this.getResponseWrapper(callback, config));
    return params;
  }

  get = (route, config, callback) => {
    return this.expressApp.get(...this.makeRouteDetails('get', route, config, callback));
  }
  post = (route, config, callback) => {
    return this.expressApp.post(...this.makeRouteDetails('post', route, config, callback));
  }
  put = (route, config, callback) => {
    return this.expressApp.put(...this.makeRouteDetails('put', route, config, callback));
  }
  patch = (route, config, callback) => {
    return this.expressApp.patch(...this.makeRouteDetails('patch', route, config, callback));
  }
  delete = (route, config, callback) => {
    return this.expressApp.delete(...this.makeRouteDetails('delete', route, config, callback));
  }
  options = (route, config, callback) => {
    return this.expressApp.options(...this.makeRouteDetails('options', route, config, callback));
  }
  any = (route, config, callback) => {
    const params = this.makeRouteDetails('any', route, config, callback);

    return [
      this.expressApp.get(...params),
      this.expressApp.put(...params),
      this.expressApp.post(...params),
      this.expressApp.patch(...params),
      this.expressApp.delete(...params),
      this.expressApp.options(...params),
    ];
  }
  use = (...passthrough) => {
    this.expressApp.use(...passthrough);
  }
  applyRoutes = (routes) => {
    for (let route of routes) {
      const { path, executor, get, options, delete: deleteRoute, patch, post, put, subrouter } = route;

      if (executor) this.any(path, executor.config, executor.callback);
      if (get) this.get(path, get.config, get.callback);
      if (post) this.post(path, post.config, post.callback);
      if (options) this.options(path, options.config, options.callback);
      if (patch) this.patch(path, patch.config, patch.callback);
      if (put) this.put(path, put.config, put.callback);
      if (deleteRoute) this.delete(path, deleteRoute.config, deleteRoute.callback);
      if (subrouter) {
        const sub = this.subrouter(path);
        sub.applyRoutes(subrouter);
      }
    }
  }
  expressApp() {
    return this.expressApp;
  }
  expressConnection() {
    return this.expressConnection;
  }
  enableCors = (origin = '*', headers = 'Origin, X-Requested-With, Content-Type, Accept') => {
    this.expressApp.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Headers', headers);
      next();
    });
    this.expressApp.options('*', (request, result) => result.status(200).send());
  }
  close = () => {
    if (this.connection) {
      this.connection.close();
    }
  }
  listen = (port, callback) => {
    this.connection = this.expressApp.listen(port, (results) => {
      console.log('listening on port', port);
      callback?.(results);
    });
    this.connection.keepAliveTimeout = 60 * 1000;
    this.connection.headersTimeout = 61 * 1000;
  }
}
