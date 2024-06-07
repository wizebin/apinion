import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _typeof from '@babel/runtime/helpers/typeof';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _createClass from '@babel/runtime/helpers/createClass';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import express from 'express';
import { Writable } from 'stream';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import http from 'http';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';

function getTypeString(data) {
  var stringType = _typeof(data);

  if (stringType === 'object') {
    if (data === null) return 'null';
    var stringified = toString.apply(data);

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

var HttpError$1 = function HttpError(_ref) {
  var status = _ref.status,
      message = _ref.message,
      data = _ref.data;

  _classCallCheck(this, HttpError);

  this.name = 'HTTP Error';
  this.status = status;
  this.message = message;
  this.data = data;
};
function stringifyError(error) {
  if (error instanceof Error) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } else {
    return JSON.stringify(error);
  }
}
function applyHttpError(request, response, error) {
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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * we recommend strongly that you do not use this, we provide this as an early development tool but you should use a request authenticator or a bearer token authenticator
 * @param {Array.<{ username: string, password: string }>} users
 * @returns function
 **/

function makeHardcodedBasicAuthenticator(users) {
  var usersByUsername = {};

  var _iterator = _createForOfIteratorHelper(users),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var user = _step.value;
      usersByUsername[user.username] = user;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var getUser = function getUser(_ref) {
    var username = _ref.username,
        password = _ref.password;
    var user = usersByUsername[username];

    if (user && user.password === password) {
      return user;
    }

    return null;
  };

  return makeBasicAuthenticator(getUser);
}
/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * This function handles base64 decoding and splitting the username and password
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 * @param {function({ username: string, password: string }, { request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromCredentials
 * @returns function
 */

function makeBasicAuthenticator(getUserFromCredentials) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(config) {
      var headers, auth, encoded, decoded, colonPosition, username, password, user;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              headers = config.headers;

              if (headers.authorization) {
                _context.next = 3;
                break;
              }

              throw new HttpError$1({
                status: 401,
                message: 'Missing Authentication'
              });

            case 3:
              if (!(headers.authorization.toLowerCase().indexOf('basic') !== 0)) {
                _context.next = 5;
                break;
              }

              throw new HttpError$1({
                status: 405,
                message: 'Incorrect Authentication'
              });

            case 5:
              auth = headers.authorization.replace(/^basic\s+/gi, '');
              encoded = Buffer.from(auth, 'base64');
              decoded = encoded.toString('utf-8');
              colonPosition = decoded.indexOf(':');
              username = decoded.substring(0, colonPosition);
              password = decoded.substring(colonPosition + 1);
              _context.next = 13;
              return getUserFromCredentials({
                username: username,
                password: password
              }, config);

            case 13:
              user = _context.sent;

              if (user) {
                _context.next = 16;
                break;
              }

              throw new HttpError$1({
                status: 401,
                message: 'Incorrect Credentials'
              });

            case 16:
              return _context.abrupt("return", user);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
}

/**
 * When you use this authenticator, the user's request will be rejected if they don't include the authorization header, or if their auth header is malformed, or if your callback function does not return an identity
 * Your callback function should return an identity structure for you to use in your endpoint handler, or null if the user is not authenticated
 * @param {function({ token: string, config: { request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromBearerFunction
 * @returns function
 */

function makeBearerTokenAuthenticator(getUserFromBearerFunction) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(config) {
      var headers, token, identity;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              headers = config.headers;

              if (headers.authorization) {
                _context.next = 3;
                break;
              }

              throw new HttpError$1({
                status: 401,
                message: 'Missing Authentication'
              });

            case 3:
              if (!(headers.authorization.toLowerCase().indexOf('bearer') !== 0)) {
                _context.next = 5;
                break;
              }

              throw new HttpError$1({
                status: 405,
                message: 'Incorrect Authentication'
              });

            case 5:
              token = headers.authorization.replace(/^bearer\s+/gi, '');
              _context.next = 8;
              return getUserFromBearerFunction(token, config);

            case 8:
              identity = _context.sent;

              if (identity) {
                _context.next = 11;
                break;
              }

              throw new HttpError$1({
                status: 401,
                message: 'Incorrect Credentials'
              });

            case 11:
              return _context.abrupt("return", identity);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

/**
 * Create an authenticator to be used in your endpoints, this authenticator can be async and should return the identity you want to use in your endpoint. identity is passed as a part of the object to your endpoint handler
 * @param {function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any} getUserFromRequest
 * @returns function
 */

function makeRequestAuthenticator(getUserFromRequest) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(params) {
      var identity;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getUserFromRequest(params);

            case 2:
              identity = _context.sent;

              if (identity) {
                _context.next = 5;
                break;
              }

              throw new HttpError$1({
                status: 401,
                message: 'Incorrect Credentials'
              });

            case 5:
              return _context.abrupt("return", identity);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

function findIndexInDirection(string, predicate) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (direction > 0) {
    for (var dex = 0; dex < string.length; dex += 1) {
      if (predicate(string[dex], dex)) return dex;
    }
  } else {
    for (var _dex = string.length - 1; _dex >= 0; _dex -= 1) {
      if (predicate(string[_dex], _dex)) return _dex + 1;
    }
  }

  return null;
}

function joinWithSingle(parts, joiner) {
  if (!joiner) return parts.join('');
  var cleanedPartArray = parts.map(function (item, dex) {
    var firstNonJoiner = dex === 0 ? 0 : findIndexInDirection(item, function (letter) {
      return letter !== joiner;
    }, 1);
    var finalNonJoiner = dex === parts.length - 1 ? item.length : findIndexInDirection(item, function (letter) {
      return letter !== joiner;
    }, -1);
    return item.slice(firstNonJoiner, finalNonJoiner);
  });
  return cleanedPartArray.join(joiner);
}

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var startingChars = {
  '{': 'json',
  '[': 'json',
  '<': 'xml'
};
function parseBody(input) {
  if (!input) return null;
  var inputType = getTypeString(input);

  if (inputType === 'string') {
    var startingType = startingChars[input[0]];

    if (startingType === 'json') {
      try {
        var _output = JSON.parse(input);

        return _output;
      } catch (err) {// not json
      }
    }

    var sections = input.split('&');
    var output = {};

    var _iterator = _createForOfIteratorHelper$1(sections),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var section = _step.value;
        var parts = section.split('=').map(function (item) {
          return decodeURIComponent(item);
        });
        output[parts[0]] = parts[1];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var WritableBufferStream = /*#__PURE__*/function (_Writable) {
  _inherits(WritableBufferStream, _Writable);

  var _super = _createSuper(WritableBufferStream);

  function WritableBufferStream(callback, options) {
    var _this;

    _classCallCheck(this, WritableBufferStream);

    _this = _super.call(this, options);

    _defineProperty(_assertThisInitialized(_this), "buffer", Buffer.alloc(0));

    _this.callback = callback;
    return _this;
  }

  _createClass(WritableBufferStream, [{
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      if (chunk) {
        this.buffer = Buffer.concat([this.buffer, chunk]);
      }

      callback();
    }
  }, {
    key: "_final",
    value: function _final(callback) {
      this.callback(this.buffer);
      callback();
    }
  }, {
    key: "_destroy",
    value: function _destroy() {
      this.buffer = null;
    }
  }]);

  return WritableBufferStream;
}(Writable);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getParams(keyList, _ref) {
  var body = _ref.body,
      query = _ref.query;
  var missing = [];
  var data = {};

  var _iterator = _createForOfIteratorHelper$2(keyList),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;

      if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined) {
        data[key] = body[key];
      } else if ((query === null || query === void 0 ? void 0 : query[key]) !== undefined) {
        data[key] = query[key];
      } else {
        missing.push(key);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
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
/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */


function responseWrapper(func, config, apinionRouter, type) {
  if (typeof func !== 'function') {
    if (typeof config === 'function') {
      func = config;
      config = {}; // we COULD throw here, but it's perhaps better to just let people do what they want
    } else {
      throw new Error('endpoint executor must be a function check config (this happens when you use makeEndpoint inside of a get/post/any, or if you forget the config parameter) ' + JSON.stringify(config));
    }
  }

  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(request, response, extras) {
      var body, params, _getParams, missing, data, _getParams2, _missing, _data, endpointResponse, _config, _config$onError, _apinionRouter$onErro, _config2;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (config.noParse) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return collectBody(request);

            case 4:
              request.raw = _context.sent;
              body = parseBody(request.raw.toString());
              request.body = body;

            case 7:
              params = _objectSpread({
                request: request,
                response: response,
                body: config.noParse ? undefined : request.body,
                query: request.query,
                headers: request.headers,
                params: Object.assign({}, request.query || {}, request.body || {})
              }, extras);

              if (!config.authenticator) {
                _context.next = 12;
                break;
              }

              _context.next = 11;
              return config.authenticator(params);

            case 11:
              params.identity = _context.sent;

            case 12:
              if (!config.required) {
                _context.next = 17;
                break;
              }

              _getParams = getParams(config.required, params), missing = _getParams.missing, data = _getParams.data;

              if (!(missing.length > 0)) {
                _context.next = 16;
                break;
              }

              throw new HttpError$1({
                status: 400,
                message: "missing params: ".concat(missing.map(function (item) {
                  return "\"".concat(item, "\"");
                }).join(', '))
              });

            case 16:
              params.required = data;

            case 17:
              if (!config.hidden_required) {
                _context.next = 22;
                break;
              }

              _getParams2 = getParams(config.hidden, params), _missing = _getParams2.missing, _data = _getParams2.data;

              if (!(_missing.length > 0)) {
                _context.next = 21;
                break;
              }

              throw new HttpError$1({
                status: 400,
                message: 'your request is incomplete (this is probably because you are missing some essential hidden requirement)'
              });

            case 21:
              params.hidden = _data;

            case 22:
              _context.next = 24;
              return func(params);

            case 24:
              endpointResponse = _context.sent;

              if (type === 'upgrade') ; else {
                if (!response._headerSent) {
                  if (typeof endpointResponse === 'string') {
                    response.send(endpointResponse);
                  } else {
                    response.json(endpointResponse);
                  }
                }
              }

              _context.next = 41;
              break;

            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](0);
              _context.prev = 30;
              _context.next = 33;
              return (_config = config) === null || _config === void 0 ? void 0 : (_config$onError = _config.onError) === null || _config$onError === void 0 ? void 0 : _config$onError.call(_config, _objectSpread({
                error: _context.t0,
                config: config,
                request: request,
                response: response
              }, extras));

            case 33:
              _context.next = 35;
              return apinionRouter === null || apinionRouter === void 0 ? void 0 : (_apinionRouter$onErro = apinionRouter.onError) === null || _apinionRouter$onErro === void 0 ? void 0 : _apinionRouter$onErro.call(apinionRouter, _objectSpread({
                error: _context.t0,
                config: config,
                request: request,
                response: response
              }, extras));

            case 35:
              _context.next = 40;
              break;

            case 37:
              _context.prev = 37;
              _context.t1 = _context["catch"](30);
              console.error("custom error handler threw error (check your onError handler in your ".concat(((_config2 = config) === null || _config2 === void 0 ? void 0 : _config2.route) || request.originalUrl, " endpoint) (check your apinionRouter.onError function)"), _context.t1);

            case 40:
              if (!response._headerSent) {
                // this gets tricky with upgrade requests, you can manually set this flag in your config error handler if you want to avoid the extra data
                applyHttpError(request, response, _context.t0);
              }

            case 41:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 28], [30, 37]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();
}

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var wsRequest = /*#__PURE__*/function (_http$IncomingMessage) {
  _inherits(wsRequest, _http$IncomingMessage);

  var _super = _createSuper$1(wsRequest);

  function wsRequest() {
    _classCallCheck(this, wsRequest);

    return _super.call(this);
  }

  return wsRequest;
}(http.IncomingMessage);
var wsResponse = /*#__PURE__*/function (_http$OutgoingMessage) {
  _inherits(wsResponse, _http$OutgoingMessage);

  var _super2 = _createSuper$1(wsResponse);

  function wsResponse(request, socket, configuration) {
    var _this;

    _classCallCheck(this, wsResponse);

    _this = _super2.call(this, request, configuration);
    /**
     * @type {import('net').Socket}
     */

    _this.sock = socket;

    if (!_this[Symbol('kSocket')]) {
      _this[Symbol('kSocket')] = socket;
    }

    return _this;
  }

  _createClass(wsResponse, [{
    key: "status",
    value: function status(code) {
      this.statusCode = code;
      return this;
    }
  }, {
    key: "getHeadersString",
    value: function getHeadersString() {}
  }, {
    key: "send",
    value: function send(data) {
      var _this$sock;

      if (!this.sock || (_this$sock = this.sock) !== null && _this$sock !== void 0 && _this$sock.destroyed) {
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
      this._headerSent = true; // unsure why this doesn't work :/
      // for now let's stick with direct socket writing and move on with our lives
      // this.status(this.statusCode || 200);
      // if (data instanceof Buffer || typeof data === 'string') {
      //   this.end(data); // same as this.write then this.end
      // } else if (typeof data === 'object') {
      //   this.end(JSON.stringify(data)); // same as this.write then this.end
      // } else {
      //   this.end(`${data}`);
      // }
    }
  }, {
    key: "json",
    value: function json(data) {
      this.send(JSON.stringify(data));
    }
  }, {
    key: "_implicitHeader",
    value: function _implicitHeader() {
      if (this._header) {
        return;
      }

      this._storeHeader(this.method + ' ' + this.path + ' HTTP/1.1\r\n', this[Symbol('kOutHeaders')]);
    }
  }]);

  return wsResponse;
}(http.OutgoingMessage);

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function parseQueryParams(queryString) {
  var sections = queryString.split('&');
  var output = {};

  var _iterator = _createForOfIteratorHelper$3(sections),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var section = _step.value;
      var parts = section.split('=').map(function (item) {
        return decodeURIComponent(item);
      });
      output[parts[0]] = parts[1];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return output;
}
function parseQueryParamsFromUrl(url) {
  var _url$split = url.split('?'),
      _url$split2 = _slicedToArray(_url$split, 2),
      path = _url$split2[0],
      queryString = _url$split2[1];

  if (!queryString) return {};
  return parseQueryParams(queryString);
}

function _createForOfIteratorHelper$4(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var Router = /*#__PURE__*/function () {
  /**
   * @param {express} app
   * @param {Router} parent
   * @param {string} baseDirectory
   */
  function Router(expressApp, parent, baseDirectory) {
    var _this = this;

    _classCallCheck(this, Router);

    _defineProperty(this, "addErrorHandler", function (callback) {
      _this.onErrorCallback = callback;
    });

    _defineProperty(this, "handleResponseCallback", function (req, res) {
      if (_this.onResponseCallback) {
        _this.onResponseCallback(req, res);
      }
    });

    _defineProperty(this, "handleEarlyDisconnect", function (req, res) {
      if (_this.onEarlyDisconnectCallback) {
        _this.onEarlyDisconnectCallback(req, res);
      }
    });

    _defineProperty(this, "addResponseCallback", function (callback) {
      if (!_this.onResponseCallback) {
        // only add the middleware once, it will call the callback using our class handleResponseCallback method
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
    });

    _defineProperty(this, "addEarlyDisconnectCallback", function (callback) {
      if (!_this.onEarlyDisconnectCallback) {
        // only add the middleware once, it will call the callback using our class handleEarlyDisconnect method
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
    });

    _defineProperty(this, "onError", function () {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      if (_this.onErrorCallback) {
        return _this.onErrorCallback.apply(_this, params);
      } else {
        var _this$parent;

        (_this$parent = _this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.onError.apply(_this$parent, params);
      }
    });

    _defineProperty(this, "handle404", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(request, response) {
        var _this$onError;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (_this$onError = _this.onError) === null || _this$onError === void 0 ? void 0 : _this$onError.call(_this, {
                  error: new HttpError$1({
                    status: 404,
                    message: 'No Matching Route',
                    data: {
                      fallthrough: true
                    }
                  }),
                  request: request,
                  response: response
                });

              case 2:
                if (!response._headerSent) {
                  response.status(404).send('Not Found');
                }

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "setAuthenticator", function (authenticator) {
      _this.authenticator = authenticator;
    });

    _defineProperty(this, "getRoutes", function () {
      var result = {};
      var keyList = Object.keys(_this.routes);

      for (var _i = 0, _keyList = keyList; _i < _keyList.length; _i++) {
        var key = _keyList[_i];
        var info = Object.assign({}, _this.routes[key]);

        if (info.subrouter) {
          var _info$subrouter$getRo, _info$subrouter;

          info.subrouter = (_info$subrouter$getRo = (_info$subrouter = info.subrouter).getRoutes) === null || _info$subrouter$getRo === void 0 ? void 0 : _info$subrouter$getRo.call(_info$subrouter);
        }

        result[key] = info;
      }

      return result;
    });

    _defineProperty(this, "getCleanedSubPath", function (path) {
      var subPath = _this.getSubPath(path);

      if (subPath.length > 0 && subPath[0] !== '/') return '/' + subPath; // http://server.comFIX => http://server.com/FIX

      return subPath;
    });

    _defineProperty(this, "getSubPath", function (path) {
      if (!_this.baseDirectory) return path;
      if (path === '/') return _this.baseDirectory;
      return joinWithSingle([_this.baseDirectory, path], '/');
    });

    _defineProperty(this, "describeSubroute", function (subdirectory, meta) {
      if (!_this.routes[subdirectory]) _this.routes[subdirectory] = {};
      Object.assign(_this.routes[subdirectory], meta);
    });

    _defineProperty(this, "subrouter", function (subdirectory) {
      var subRouter = new Router(_this.app, _this, _this.getCleanedSubPath(subdirectory));
      subRouter.setAuthenticator(_this.authenticator);

      _this.describeSubroute(subdirectory, {
        subrouter: subRouter
      });

      return subRouter;
    });

    _defineProperty(this, "getResponseWrapper", function (callback) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = arguments.length > 2 ? arguments[2] : undefined;

      if (_this.authenticator && !config.authenticator) {
        config.authenticator = _this.authenticator;
      }

      return responseWrapper(callback, config, _this, type);
    });

    _defineProperty(this, "makeRouteDetails", function (type, route, config, callback) {
      var defaultedConfig = config || {};

      var cleanedPath = _this.getCleanedSubPath(route);

      if (!defaultedConfig.route) defaultedConfig.route = cleanedPath;

      _this.describeSubroute(cleanedPath, _defineProperty({}, type, defaultedConfig));

      var params = [cleanedPath];

      if (defaultedConfig !== null && defaultedConfig !== void 0 && defaultedConfig.middleware) {
        params = params.concat(defaultedConfig.middleware);
      }

      params.push(_this.getResponseWrapper(callback, defaultedConfig, type));
      return params;
    });

    _defineProperty(this, "get", function (route, config, callback) {
      var _this$app;

      return (_this$app = _this.app).get.apply(_this$app, _toConsumableArray(_this.makeRouteDetails('get', route, config, callback)));
    });

    _defineProperty(this, "post", function (route, config, callback) {
      var _this$app2;

      return (_this$app2 = _this.app).post.apply(_this$app2, _toConsumableArray(_this.makeRouteDetails('post', route, config, callback)));
    });

    _defineProperty(this, "put", function (route, config, callback) {
      var _this$app3;

      return (_this$app3 = _this.app).put.apply(_this$app3, _toConsumableArray(_this.makeRouteDetails('put', route, config, callback)));
    });

    _defineProperty(this, "patch", function (route, config, callback) {
      var _this$app4;

      return (_this$app4 = _this.app).patch.apply(_this$app4, _toConsumableArray(_this.makeRouteDetails('patch', route, config, callback)));
    });

    _defineProperty(this, "delete", function (route, config, callback) {
      var _this$app5;

      return (_this$app5 = _this.app)["delete"].apply(_this$app5, _toConsumableArray(_this.makeRouteDetails('delete', route, config, callback)));
    });

    _defineProperty(this, "options", function (route, config, callback) {
      var _this$app6;

      return (_this$app6 = _this.app).options.apply(_this$app6, _toConsumableArray(_this.makeRouteDetails('options', route, config, callback)));
    });

    _defineProperty(this, "upgrade", function (route, config, callback) {
      config = config || {};
      config.noParse = true; // must have noParse to avoid piping the socket

      var routeDetails = _this.makeRouteDetails('upgrade', route, config, callback);

      _this.propagateUpgradeToRootRouter(routeDetails[0], routeDetails[routeDetails.length - 1]);
    });

    _defineProperty(this, "propagateUpgradeToRootRouter", function (fullRoute, callback) {
      if (_this.parent) {
        _this.parent.propagateUpgradeToRootRouter(fullRoute, callback);
      } else {
        _this.upgradeRoutes.push([fullRoute, callback]);

        _this.globalUpgrade(_this.handleInternalUpgrade); // deduplicates

      }
    });

    _defineProperty(this, "handleInternalUpgrade", function (request, socket, head) {
      var url = request.url;

      var _iterator = _createForOfIteratorHelper$4(_this.upgradeRoutes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var upgradeDetails = _step.value;
          var route = upgradeDetails[0]; // ignoring middleware second parameter, which is normally sent to app.get app.post, etc as the second parameter optionally

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
            callback(innerRequest, innerResponse, {
              socket: socket,
              head: head
            });
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (_this.destroyUnmatchedSocketRequests) {
        socket.destroy();
      }
    });

    _defineProperty(this, "any", function (route, config, callback) {
      var _this$app7, _this$app8, _this$app9, _this$app10, _this$app11, _this$app12;

      var params = _this.makeRouteDetails('any', route, config, callback);

      return [(_this$app7 = _this.app).get.apply(_this$app7, _toConsumableArray(params)), (_this$app8 = _this.app).put.apply(_this$app8, _toConsumableArray(params)), (_this$app9 = _this.app).post.apply(_this$app9, _toConsumableArray(params)), (_this$app10 = _this.app).patch.apply(_this$app10, _toConsumableArray(params)), (_this$app11 = _this.app)["delete"].apply(_this$app11, _toConsumableArray(params)), (_this$app12 = _this.app).options.apply(_this$app12, _toConsumableArray(params))];
    });

    _defineProperty(this, "use", function (func) {
      var _this$app13;

      for (var _len2 = arguments.length, passthrough = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        passthrough[_key2 - 1] = arguments[_key2];
      }

      (_this$app13 = _this.app).use.apply(_this$app13, [func].concat(passthrough));
    });

    _defineProperty(this, "globalUpgrade", function (func) {
      if (_this.upgradeFunctions.indexOf(func) === -1) {
        _this.upgradeFunctions.push(func);

        if (_this.connection) {
          _this.attachUpgradeFunction(func);
        }
      }
    });

    _defineProperty(this, "attachUpgradeFunction", function (func) {
      if (_this.connection) {
        _this.connection.on('upgrade', func);
      }
    });

    _defineProperty(this, "detachUpgradeFunction", function (func) {
      if (_this.connection) {
        _this.connection.off('upgrade', func);
      }

      var index = _this.upgradeFunctions.indexOf(func);

      if (index > -1) {
        _this.upgradeFunctions.splice(index, 1);
      }
    });

    _defineProperty(this, "applyConnectionHandlers", function () {
      var _this$upgradeFunction;

      if ((_this$upgradeFunction = _this.upgradeFunctions) !== null && _this$upgradeFunction !== void 0 && _this$upgradeFunction.length) {
        var _iterator2 = _createForOfIteratorHelper$4(_this.upgradeFunctions),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var func = _step2.value;

            _this.attachUpgradeFunction(func);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    });

    _defineProperty(this, "applyRoutes", function (routes) {
      if (Array.isArray && !Array.isArray(routes)) {
        routes = [routes];
      }

      var _iterator3 = _createForOfIteratorHelper$4(routes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var route = _step3.value;
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
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    });

    _defineProperty(this, "enableCors", function () {
      var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
      var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

      _this.app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', headers);
        next();
      });

      _this.app.options('*', function (request, result) {
        return result.status(200).send();
      });
    });

    _defineProperty(this, "close", function () {
      if (_this.connection) {
        _this.connection.close();
      }
    });

    _defineProperty(this, "listen", function (port, callback) {
      return new Promise(function (resolve, reject) {
        _this.connection = _this.app.listen(port, function (results) {
          console.log('listening on port', port);
          callback === null || callback === void 0 ? void 0 : callback(results);

          _this.app.removeListener('error', reject);

          resolve(results);
        });

        _this.app.use(function (request, response, next) {
          _this.handle404(request, response);
        });

        _this.app.once('error', reject);

        _this.connection.keepAliveTimeout = 60 * 1000;
        _this.connection.headersTimeout = 61 * 1000;

        _this.applyConnectionHandlers();
      });
    });

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


  _createClass(Router, [{
    key: "expressApp",

    /**
     * @returns {express.Express}
     */
    value: function expressApp() {
      return this.app;
    }
  }]);

  return Router;
}();

/**
 * Create an api endpoint object, add to your router with methods like router.get, router.post, etc.
 * @param {{ required: string[]?, hidden_required: string[]?, authenticator: function({ request: express.Request, response: express.Response, body: object, query: object, headers: object, params: object }):any, noParse: boolean?, onError: function({ request, response, error }):null }} config
 * @param {function({ request: express.Request, response: express.Response, identity: any, body: object, query: object, headers: object, params: object }):void} executionFunction
 * @returns {{ config: any, callback: any }}
 */
function makeEndpoint(config, executionFunction) {
  return {
    config: config,
    callback: executionFunction
  };
}

export { HttpError$1 as HttpError, Router, makeBasicAuthenticator, makeBearerTokenAuthenticator, makeEndpoint, makeHardcodedBasicAuthenticator, makeRequestAuthenticator };
//# sourceMappingURL=index.mjs.map
