import _typeof from '@babel/runtime/helpers/typeof';
import express from 'express';
import { Writable } from 'stream';
import * as http from 'http';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function getTypeString(data) {
  var stringType = _typeof(data);
  if (stringType === 'object') {
    if (data === null) return 'null';
    var stringified = Object.prototype.toString.call(data);
    if (stringified.length > 2 && stringified[0] === '[' && stringified[stringified.length - 1] === ']') {
      var splits = stringified.substr(1, stringified.length - 2).split(' ');
      if (splits.length > 1) {
        return splits.slice(1).join(' ').toLowerCase();
      }
    }
    return 'unknown';
  }
  if (stringType === 'number') {
    if (isNaN(data)) return 'nan';
  }
  return stringType;
}

var HttpError = function (_super) {
  __extends(HttpError, _super);
  function HttpError(_a) {
    var status = _a.status,
      message = _a.message,
      data = _a.data;
    var _this = _super.call(this, message) || this;
    _this.name = 'HTTP Error';
    _this.status = status;
    _this.message = message;
    _this.data = data;
    return _this;
  }
  return HttpError;
}(Error);
function stringifyError(error) {
  if (error instanceof Error) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } else {
    return JSON.stringify(error);
  }
}
function applyHttpError(_request, response, error) {
  var status = (error === null || error === void 0 ? void 0 : error.status) || 500;
  var message = (error === null || error === void 0 ? void 0 : error.message) || 'Uncaught Error Without Message';
  var data = (error === null || error === void 0 ? void 0 : error.data) || {};
  response.status(status);
  if (getTypeString(message) === 'object') {
    response.json(Object.assign(data, message));
  } else if (message) {
    response.json(Object.assign(data, {
      message: message
    }));
  } else {
    response.send(stringifyError(error));
  }
}

function makeHardcodedBasicAuthenticator(users) {
  var e_1, _a;
  var usersByUsername = {};
  try {
    for (var users_1 = __values(users), users_1_1 = users_1.next(); !users_1_1.done; users_1_1 = users_1.next()) {
      var user = users_1_1.value;
      usersByUsername[user.username] = user;
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (users_1_1 && !users_1_1.done && (_a = users_1["return"])) _a.call(users_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  var getUser = function getUser(_a) {
    var username = _a.username,
      password = _a.password;
    var user = usersByUsername[username];
    if (user && user.password === password) {
      return user;
    }
    return null;
  };
  return makeBasicAuthenticator(getUser);
}
function makeBasicAuthenticator(getUserFromCredentials) {
  var _this = this;
  return function (config) {
    return __awaiter(_this, void 0, void 0, function () {
      var headers, auth, encoded, decoded, colonPosition, username, password, user;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            headers = config.headers;
            if (!headers.authorization) {
              throw new HttpError({
                status: 401,
                message: 'Missing Authentication'
              });
            }
            if (headers.authorization.toLowerCase().indexOf('basic') !== 0) {
              throw new HttpError({
                status: 405,
                message: 'Incorrect Authentication'
              });
            }
            auth = headers.authorization.replace(/^basic\s+/gi, '');
            encoded = Buffer.from(auth, 'base64');
            decoded = encoded.toString('utf-8');
            colonPosition = decoded.indexOf(':');
            username = decoded.substring(0, colonPosition);
            password = decoded.substring(colonPosition + 1);
            return [4, getUserFromCredentials({
              username: username,
              password: password
            }, config)];
          case 1:
            user = _a.sent();
            if (!user) {
              throw new HttpError({
                status: 401,
                message: 'Incorrect Credentials'
              });
            }
            return [2, user];
        }
      });
    });
  };
}

function makeBearerTokenAuthenticator(getUserFromBearerFunction) {
  var _this = this;
  return function (config) {
    return __awaiter(_this, void 0, void 0, function () {
      var headers, token, identity;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            headers = config.headers;
            if (!headers.authorization) {
              throw new HttpError({
                status: 401,
                message: 'Missing Authentication'
              });
            }
            if (headers.authorization.toLowerCase().indexOf('bearer') !== 0) {
              throw new HttpError({
                status: 405,
                message: 'Incorrect Authentication'
              });
            }
            token = headers.authorization.replace(/^bearer\s+/gi, '');
            return [4, getUserFromBearerFunction(token, config)];
          case 1:
            identity = _a.sent();
            if (!identity) {
              throw new HttpError({
                status: 401,
                message: 'Incorrect Credentials'
              });
            }
            return [2, identity];
        }
      });
    });
  };
}

function makeRequestAuthenticator(getUserFromRequest) {
  var _this = this;
  return function (params) {
    return __awaiter(_this, void 0, void 0, function () {
      var identity;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4, getUserFromRequest(params)];
          case 1:
            identity = _a.sent();
            if (!identity) {
              throw new HttpError({
                status: 401,
                message: 'Incorrect Credentials'
              });
            }
            return [2, identity];
        }
      });
    });
  };
}

function findIndexInDirection(string, predicate, direction) {
  if (direction === void 0) {
    direction = 1;
  }
  if (direction > 0) {
    for (var dex = 0; dex < string.length; dex += 1) {
      if (predicate(string[dex], dex)) return dex;
    }
  } else {
    for (var dex = string.length - 1; dex >= 0; dex -= 1) {
      if (predicate(string[dex], dex)) return dex + 1;
    }
  }
  return null;
}
function joinWithSingle(parts, joiner) {
  var cleanedPartArray = parts.map(function (item, dex) {
    var firstNonJoiner = dex === 0 ? 0 : findIndexInDirection(item, function (letter) {
      return letter !== joiner;
    }, 1);
    var finalNonJoiner = dex === parts.length - 1 ? item.length : findIndexInDirection(item, function (letter) {
      return letter !== joiner;
    }, -1);
    return item.slice(firstNonJoiner || 0, finalNonJoiner || undefined);
  });
  return cleanedPartArray.join(joiner);
}

var startingChars = {
  '{': 'json',
  '[': 'json',
  '<': 'xml'
};
function parseBody(input) {
  var e_1, _a;
  if (!input) return null;
  var inputType = getTypeString(input);
  if (inputType === 'string') {
    var startingType = startingChars[input[0]];
    if (startingType === 'json') {
      try {
        var output_1 = JSON.parse(input);
        return output_1;
      } catch (err) {}
    }
    var sections = input.split('&');
    var output = {};
    try {
      for (var sections_1 = __values(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
        var section = sections_1_1.value;
        var parts = section.split('=').map(function (item) {
          return decodeURIComponent(item);
        });
        output[parts[0]] = parts[1];
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (sections_1_1 && !sections_1_1.done && (_a = sections_1["return"])) _a.call(sections_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return output;
  }
  if (inputType === 'array' || inputType === 'object') {
    return input;
  }
  throw new HttpError({
    status: 500,
    message: "issue parsing body, it came in as ".concat(inputType, ", but string is the only supported method")
  });
}

var WritableBufferStream = function (_super) {
  __extends(WritableBufferStream, _super);
  function WritableBufferStream(callback, options) {
    var _this = _super.call(this, options) || this;
    _this.buffer = Buffer.alloc(0);
    _this.callback = callback;
    return _this;
  }
  WritableBufferStream.prototype._write = function (chunk, _encoding, callback) {
    if (chunk) {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    }
    callback();
  };
  WritableBufferStream.prototype._final = function (callback) {
    this.callback(this.buffer);
    callback();
  };
  WritableBufferStream.prototype._destroy = function (error, callback) {
    this.buffer = Buffer.alloc(0);
    if (callback) {
      callback(error);
    }
  };
  return WritableBufferStream;
}(Writable);

function getParams(keyList, _a) {
  var e_1, _b;
  var body = _a.body,
    query = _a.query;
  var missing = [];
  var data = {};
  try {
    for (var keyList_1 = __values(keyList), keyList_1_1 = keyList_1.next(); !keyList_1_1.done; keyList_1_1 = keyList_1.next()) {
      var key = keyList_1_1.value;
      if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined) {
        data[key] = body[key];
      } else if ((query === null || query === void 0 ? void 0 : query[key]) !== undefined) {
        data[key] = query[key];
      } else {
        missing.push(key);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (keyList_1_1 && !keyList_1_1.done && (_b = keyList_1["return"])) _b.call(keyList_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return {
    missing: missing,
    data: data
  };
}
function collectBody(request) {
  return new Promise(function (resolve, reject) {
    var output = new WritableBufferStream(resolve);
    output.on('error', reject);
    request.pipe(output);
  });
}
function responseWrapper(func, config, apinionRouter, type) {
  var _this = this;
  var actualFunc;
  var actualConfig;
  if (typeof func !== 'function') {
    if (typeof config === 'function') {
      actualFunc = config;
      actualConfig = {};
    } else {
      throw new Error('endpoint executor must be a function check config (this happens when you use makeEndpoint inside of a get/post/any, or if you forget the config parameter) ' + JSON.stringify(config));
    }
  } else {
    actualFunc = func;
    actualConfig = config || {};
  }
  return function (request, response, extras) {
    return __awaiter(_this, void 0, void 0, function () {
      var _a, body, params, _b, _c, missing, data, _d, missing, data, endpointResponse, err_1, subError_1;
      var _e, _f;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            _g.trys.push([0, 6,, 12]);
            if (!!actualConfig.noParse) return [3, 2];
            _a = request;
            return [4, collectBody(request)];
          case 1:
            _a.raw = _g.sent();
            body = parseBody(request.raw.toString());
            request.body = body;
            _g.label = 2;
          case 2:
            params = __assign({
              request: request,
              response: response,
              body: actualConfig.noParse ? undefined : request.body,
              query: request.query,
              headers: request.headers,
              params: Object.assign({}, request.query || {}, request.body || {})
            }, extras);
            if (!actualConfig.authenticator) return [3, 4];
            _b = params;
            return [4, actualConfig.authenticator(params)];
          case 3:
            _b.identity = _g.sent();
            _g.label = 4;
          case 4:
            if (actualConfig.required) {
              _c = getParams(actualConfig.required, params), missing = _c.missing, data = _c.data;
              if (missing.length > 0) {
                throw new HttpError({
                  status: 400,
                  message: "missing params: ".concat(missing.map(function (item) {
                    return "\"".concat(item, "\"");
                  }).join(', '))
                });
              }
              params.required = data;
            }
            if (actualConfig.hidden_required) {
              _d = getParams(actualConfig.hidden_required, params), missing = _d.missing, data = _d.data;
              if (missing.length > 0) {
                throw new HttpError({
                  status: 400,
                  message: 'your request is incomplete (this is probably because you are missing some essential hidden requirement)'
                });
              }
              params.hidden = data;
            }
            return [4, actualFunc(params)];
          case 5:
            endpointResponse = _g.sent();
            if (type === 'upgrade') ; else {
              if (!response._headerSent) {
                if (typeof endpointResponse === 'string') {
                  response.send(endpointResponse);
                } else {
                  response.json(endpointResponse);
                }
              }
            }
            return [3, 12];
          case 6:
            err_1 = _g.sent();
            _g.label = 7;
          case 7:
            _g.trys.push([7, 10,, 11]);
            return [4, (_e = actualConfig === null || actualConfig === void 0 ? void 0 : actualConfig.onError) === null || _e === void 0 ? void 0 : _e.call(actualConfig, __assign({
              error: err_1,
              config: actualConfig,
              request: request,
              response: response
            }, extras))];
          case 8:
            _g.sent();
            return [4, (_f = apinionRouter === null || apinionRouter === void 0 ? void 0 : apinionRouter.onError) === null || _f === void 0 ? void 0 : _f.call(apinionRouter, __assign({
              error: err_1,
              config: actualConfig,
              request: request,
              response: response
            }, extras))];
          case 9:
            _g.sent();
            return [3, 11];
          case 10:
            subError_1 = _g.sent();
            console.error("custom error handler threw error (check your onError handler in your ".concat((actualConfig === null || actualConfig === void 0 ? void 0 : actualConfig.route) || request.originalUrl, " endpoint) (check your apinionRouter.onError function)"), subError_1);
            return [3, 11];
          case 11:
            if (!response._headerSent) {
              applyHttpError(request, response, err_1);
            }
            return [3, 12];
          case 12:
            return [2];
        }
      });
    });
  };
}

var wsRequest = function (_super) {
  __extends(wsRequest, _super);
  function wsRequest() {
    return _super.call(this, {}) || this;
  }
  return wsRequest;
}(http.IncomingMessage);
var wsResponse = function (_super) {
  __extends(wsResponse, _super);
  function wsResponse(_request, socket, _configuration) {
    var _this = _super.call(this) || this;
    _this._headerSent = false;
    _this.sock = socket;
    var socketSymbol = Symbol["for"]('kSocket');
    if (!_this[socketSymbol]) {
      _this[socketSymbol] = socket;
    }
    _this.statusCode = 200;
    return _this;
  }
  wsResponse.prototype.status = function (code) {
    this.statusCode = code;
    return this;
  };
  wsResponse.prototype.getHeadersString = function () {};
  wsResponse.prototype.send = function (data) {
    if (!this.sock || this.sock.destroyed) {
      return;
    }
    this.status(this.statusCode || 200);
    if (this._header) {
      this.sock.write(this._header);
    } else {
      this.sock.write('HTTP/1.1 ' + this.statusCode + ' ' + http.STATUS_CODES[this.statusCode] + '\r\n');
    }
    this.sock.write('\r\n');
    if (data instanceof Buffer || typeof data === 'string') {
      this.sock.write(data);
    } else {
      this.sock.write(JSON.stringify(data));
    }
    this.sock.end();
    this._headerSent = true;
  };
  wsResponse.prototype.json = function (data) {
    this.send(JSON.stringify(data));
  };
  wsResponse.prototype._implicitHeader = function () {
    if (this._header) {
      return;
    }
    var method = this.method || 'GET';
    var path = this.path || '/';
    var kOutHeaders = Symbol["for"]('kOutHeaders');
    this._storeHeader(method + ' ' + path + ' HTTP/1.1\r\n', this[kOutHeaders]);
  };
  return wsResponse;
}(http.OutgoingMessage);

function parseQueryParams(queryString) {
  var e_1, _a;
  var sections = queryString.split('&');
  var output = {};
  try {
    for (var sections_1 = __values(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
      var section = sections_1_1.value;
      var parts = section.split('=').map(function (item) {
        return decodeURIComponent(item);
      });
      output[parts[0]] = parts[1];
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (sections_1_1 && !sections_1_1.done && (_a = sections_1["return"])) _a.call(sections_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return output;
}
function parseQueryParamsFromUrl(url) {
  var _a = __read(url.split('?'), 2);
    _a[0];
    var queryString = _a[1];
  if (!queryString) return {};
  return parseQueryParams(queryString);
}

var Router = function () {
  function Router(expressApp, parent, baseDirectory) {
    var _this = this;
    this.addErrorHandler = function (callback) {
      _this.onErrorCallback = callback;
    };
    this.handleResponseCallback = function (params) {
      if (_this.onResponseCallback) {
        _this.onResponseCallback(params);
      }
    };
    this.handleEarlyDisconnect = function (params) {
      if (_this.onEarlyDisconnectCallback) {
        _this.onEarlyDisconnectCallback(params);
      }
    };
    this.addResponseCallback = function (callback) {
      if (!_this.onResponseCallback) {
        _this.responseMiddleFunc = function (req, res, next) {
          res.on('finish', function () {
            _this.handleResponseCallback({
              request: req,
              response: res,
              status: res.statusCode
            });
          });
          next();
        };
        _this.app.use(_this.responseMiddleFunc);
      }
      _this.onResponseCallback = callback;
    };
    this.addEarlyDisconnectCallback = function (callback) {
      if (!_this.onEarlyDisconnectCallback) {
        _this.earlyDisconnectMiddleFunc = function (req, res, next) {
          res.on('close', function () {
            if (!res.headersSent) {
              _this.handleEarlyDisconnect({
                request: req,
                response: res,
                status: res.statusCode
              });
            }
          });
          next();
        };
        _this.app.use(_this.earlyDisconnectMiddleFunc);
      }
      _this.onEarlyDisconnectCallback = callback;
    };
    this.onError = function (params) {
      var _a;
      if (_this.onErrorCallback) {
        return _this.onErrorCallback(params);
      } else {
        (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.onError(params);
      }
    };
    this.handle404 = function (request, response) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (this.onError) {
            this.onError({
              error: new HttpError({
                status: 404,
                message: 'No Matching Route',
                data: {
                  fallthrough: true
                }
              }),
              request: request,
              response: response
            });
          }
          if (!response._headerSent) {
            response.status(404).send('Not Found');
          }
          return [2];
        });
      });
    };
    this.setAuthenticator = function (authenticator) {
      _this.authenticator = authenticator;
    };
    this.getRoutes = function () {
      var e_1, _a;
      var _b, _c;
      var result = {};
      var keyList = Object.keys(_this.routes);
      try {
        for (var keyList_1 = __values(keyList), keyList_1_1 = keyList_1.next(); !keyList_1_1.done; keyList_1_1 = keyList_1.next()) {
          var key = keyList_1_1.value;
          var info = Object.assign({}, _this.routes[key]);
          if (info.subrouter) {
            info.subrouter = (_c = (_b = info.subrouter).getRoutes) === null || _c === void 0 ? void 0 : _c.call(_b);
          }
          result[key] = info;
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (keyList_1_1 && !keyList_1_1.done && (_a = keyList_1["return"])) _a.call(keyList_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return result;
    };
    this.getCleanedSubPath = function (path) {
      var subPath = _this.getSubPath(path);
      if (subPath.length > 0 && subPath[0] !== '/') return '/' + subPath;
      return subPath;
    };
    this.getSubPath = function (path) {
      if (!_this.baseDirectory) return path;
      if (path === '/') return _this.baseDirectory;
      return joinWithSingle([_this.baseDirectory, path], '/');
    };
    this.describeSubroute = function (subdirectory, meta) {
      if (!_this.routes[subdirectory]) _this.routes[subdirectory] = {};
      Object.assign(_this.routes[subdirectory], meta);
    };
    this.subrouter = function (subdirectory) {
      var subRouter = new Router(_this.app, _this, _this.getCleanedSubPath(subdirectory));
      subRouter.setAuthenticator(_this.authenticator);
      _this.describeSubroute(subdirectory, {
        subrouter: subRouter
      });
      return subRouter;
    };
    this.getResponseWrapper = function (callback, config, type) {
      if (config === void 0) {
        config = {};
      }
      if (_this.authenticator && !config.authenticator) {
        config.authenticator = _this.authenticator;
      }
      var endpointConfig = {
        required: config.required,
        hidden_required: config.hidden_required,
        authenticator: config.authenticator,
        noParse: config.noParse,
        onError: config.onError ? function (params) {
          config.onError(params);
        } : undefined,
        route: config.route
      };
      var endpointExecutor = function endpointExecutor(params) {
        return callback(params);
      };
      return responseWrapper(endpointExecutor, endpointConfig, _this, type);
    };
    this.makeRouteDetails = function (type, route, config, callback) {
      var _a;
      var defaultedConfig = config || {};
      var cleanedPath = typeof route === 'string' ? _this.getCleanedSubPath(route) : route;
      if (!defaultedConfig.route && typeof cleanedPath === 'string') defaultedConfig.route = cleanedPath;
      _this.describeSubroute(cleanedPath, (_a = {}, _a[type] = defaultedConfig, _a));
      var params = [cleanedPath];
      if (defaultedConfig === null || defaultedConfig === void 0 ? void 0 : defaultedConfig.middleware) {
        params = params.concat(defaultedConfig.middleware);
      }
      params.push(_this.getResponseWrapper(callback, defaultedConfig, type));
      return params;
    };
    this.get = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('get', route, config, callback);
      return (_a = _this.app).get.apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this.post = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('post', route, config, callback);
      return (_a = _this.app).post.apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this.put = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('put', route, config, callback);
      return (_a = _this.app).put.apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this.patch = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('patch', route, config, callback);
      return (_a = _this.app).patch.apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this["delete"] = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('delete', route, config, callback);
      return (_a = _this.app)["delete"].apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this.options = function (route, config, callback) {
      var _a;
      var routeDetails = _this.makeRouteDetails('options', route, config, callback);
      return (_a = _this.app).options.apply(_a, __spreadArray([routeDetails[0]], __read(routeDetails.slice(1)), false));
    };
    this.upgrade = function (route, config, callback) {
      config = config || {};
      config.noParse = true;
      var routeDetails = _this.makeRouteDetails('upgrade', route, config, callback);
      _this.propagateUpgradeToRootRouter(routeDetails[0], routeDetails[routeDetails.length - 1]);
    };
    this.propagateUpgradeToRootRouter = function (fullRoute, callback) {
      if (_this.parent) {
        _this.parent.propagateUpgradeToRootRouter(fullRoute, callback);
      } else {
        _this.upgradeRoutes.push([fullRoute, callback]);
        _this.globalUpgrade(_this.handleInternalUpgrade);
      }
    };
    this.handleInternalUpgrade = function (request, socket, _head) {
      var e_2, _a;
      var url = request.url;
      try {
        for (var _b = __values(_this.upgradeRoutes), _c = _b.next(); !_c.done; _c = _b.next()) {
          var upgradeDetails = _c.value;
          var route = upgradeDetails[0];
          var callback = upgradeDetails[upgradeDetails.length - 1];
          if (url.match(route)) {
            var innerRequest = new wsRequest();
            Object.assign(innerRequest, request);
            innerRequest.originalUrl = url;
            innerRequest.query = parseQueryParamsFromUrl(url);
            var innerResponse = new wsResponse(request, socket, {
              highWaterMark: socket.writableHighWaterMark,
              rejectNonStandardBodyWrites: false,
              keepAliveTimeout: 0,
              maxRequestsPerSocket: 0,
              shouldKeepAlive: true
            });
            if (typeof callback === 'function') {
              var upgradeCallback = callback;
              upgradeCallback({
                request: innerRequest,
                response: innerResponse,
                identity: undefined,
                body: undefined,
                query: innerRequest.query,
                headers: innerRequest.headers,
                params: innerRequest.query || {}
              });
            }
            return;
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
      if (_this.destroyUnmatchedSocketRequests) {
        socket.destroy();
      }
    };
    this.any = function (route, config, callback) {
      var _a, _b, _c, _d, _e, _f;
      var params = _this.makeRouteDetails('any', route, config, callback);
      return [(_a = _this.app).get.apply(_a, __spreadArray([params[0]], __read(params.slice(1)), false)), (_b = _this.app).put.apply(_b, __spreadArray([params[0]], __read(params.slice(1)), false)), (_c = _this.app).post.apply(_c, __spreadArray([params[0]], __read(params.slice(1)), false)), (_d = _this.app).patch.apply(_d, __spreadArray([params[0]], __read(params.slice(1)), false)), (_e = _this.app)["delete"].apply(_e, __spreadArray([params[0]], __read(params.slice(1)), false)), (_f = _this.app).options.apply(_f, __spreadArray([params[0]], __read(params.slice(1)), false))];
    };
    this.use = function (func) {
      var _a;
      var passthrough = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        passthrough[_i - 1] = arguments[_i];
      }
      (_a = _this.app).use.apply(_a, __spreadArray([func], __read(passthrough), false));
    };
    this.globalUpgrade = function (func) {
      if (_this.upgradeFunctions.indexOf(func) === -1) {
        _this.upgradeFunctions.push(func);
        if (_this.connection) {
          _this.attachUpgradeFunction(func);
        }
      }
    };
    this.attachUpgradeFunction = function (func) {
      if (_this.connection) {
        _this.connection.on('upgrade', func);
      }
    };
    this.detachUpgradeFunction = function (func) {
      if (_this.connection) {
        _this.connection.off('upgrade', func);
      }
      var index = _this.upgradeFunctions.indexOf(func);
      if (index > -1) {
        _this.upgradeFunctions.splice(index, 1);
      }
    };
    this.applyConnectionHandlers = function () {
      var e_3, _a;
      var _b;
      if ((_b = _this.upgradeFunctions) === null || _b === void 0 ? void 0 : _b.length) {
        try {
          for (var _c = __values(_this.upgradeFunctions), _d = _c.next(); !_d.done; _d = _c.next()) {
            var func = _d.value;
            _this.attachUpgradeFunction(func);
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      }
    };
    this.applyRoutes = function (routes) {
      var e_4, _a;
      if (!Array.isArray(routes)) {
        routes = [routes];
      }
      try {
        for (var routes_1 = __values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
          var route = routes_1_1.value;
          var path = route.path,
            executor = route.executor,
            get = route.get,
            options = route.options,
            deleteRoute = route["delete"],
            patch = route.patch,
            post = route.post,
            put = route.put,
            subrouter = route.subrouter,
            any = route.any,
            upgrade = route.upgrade;
          if (executor) _this.any(path, executor.config, executor.callback);
          if (any) _this.any(path, any.config, any.callback);
          if (get) _this.get(path, get.config, get.callback);
          if (post) _this.post(path, post.config, post.callback);
          if (options) _this.options(path, options.config, options.callback);
          if (patch) _this.patch(path, patch.config, patch.callback);
          if (put) _this.put(path, put.config, put.callback);
          if (deleteRoute) _this["delete"](path, deleteRoute.config, deleteRoute.callback);
          if (upgrade) _this.upgrade(path, upgrade.config, upgrade.callback);
          if (subrouter) {
            var sub = _this.subrouter(path);
            sub.applyRoutes(subrouter);
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (routes_1_1 && !routes_1_1.done && (_a = routes_1["return"])) _a.call(routes_1);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    };
    this.enableCors = function (origin, headers, allowedMethods) {
      if (origin === void 0) {
        origin = '*';
      }
      if (headers === void 0) {
        headers = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
      }
      if (allowedMethods === void 0) {
        allowedMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
      }
      _this.app.use(function (_req, res, next) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', headers);
        res.header('Access-Control-Allow-Methods', allowedMethods);
        next();
      });
      _this.app.options('*', function (_request, result) {
        result.status(200).send();
      });
    };
    this.close = function () {
      if (_this.connection) {
        _this.connection.close();
      }
    };
    this.listen = function (port, callback) {
      return new Promise(function (resolve, reject) {
        _this.connection = _this.app.listen(port, function (results) {
          console.log('listening on port', port);
          callback === null || callback === void 0 ? void 0 : callback(results);
          _this.app.removeListener('error', reject);
          resolve(results);
        });
        _this.app.use(function (request, response, _next) {
          _this.handle404(request, response);
        });
        _this.app.once('error', reject);
        _this.connection.keepAliveTimeout = 60 * 1000;
        _this.connection.headersTimeout = 61 * 1000;
        _this.applyConnectionHandlers();
      });
    };
    this.parent = parent;
    this.app = expressApp || express();
    this.baseDirectory = baseDirectory || '';
    this.routes = {};
    this.upgradeRoutes = [];
    this.upgradeFunctions = [];
    this.destroyUnmatchedSocketRequests = true;
  }
  Router.prototype.expressApp = function () {
    return this.app;
  };
  return Router;
}();

function makeEndpoint(config, executionFunction) {
  return {
    config: config,
    callback: executionFunction
  };
}

export { HttpError, Router, makeBasicAuthenticator, makeBearerTokenAuthenticator, makeEndpoint, makeHardcodedBasicAuthenticator, makeRequestAuthenticator };
//# sourceMappingURL=index.mjs.map
