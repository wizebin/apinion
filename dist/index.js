(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('objer'), require('express'), require('stream')) :
  typeof define === 'function' && define.amd ? define(['exports', 'objer', 'express', 'stream'], factory) :
  (global = global || self, factory(global.apinion = {}, global.objer, global.express, global.stream));
}(this, (function (exports, objer, express, stream) { 'use strict';

  express = express && Object.prototype.hasOwnProperty.call(express, 'default') ? express['default'] : express;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var HttpError$1 = function HttpError(_ref) {
    var status = _ref.status,
        message = _ref.message;

    _classCallCheck(this, HttpError);

    this.name = 'HTTP Error';
    this.status = status;
    this.message = message;
  };
  function applyHttpError(request, response, error) {
    var status = objer.get(error, 'status') || 500;
    var message = objer.get(error, 'message') || 'Uncaught Error Without Message';
    response.status(status);
    console.log(error);

    if (objer.getTypeString(message) === 'object') {
      response.json(message);
    } else if (message) {
      response.json({
        message: message
      });
    } else {
      var stringified = JSON.stringify(error);
      response.send(stringified);
    }
  }

  /**
   * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
   * @param {[{ username: string, password: string }]} users
   */

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
  function makeBasicAuthenticator(getUserFromCredentialsFunction) {
    return /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var headers, auth, encoded, decoded, colonPosition, username, password, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = _ref2.headers;

                if (headers.authorization) {
                  _context.next = 4;
                  break;
                }

                console.log(headers);
                throw new HttpError$1({
                  status: 401,
                  message: 'Missing Authentication'
                });

              case 4:
                if (!(headers.authorization.toLowerCase().indexOf('basic') !== 0)) {
                  _context.next = 6;
                  break;
                }

                throw new HttpError$1({
                  status: 405,
                  message: 'Incorrect Authentication'
                });

              case 6:
                auth = headers.authorization.replace(/^basic\s+/gi, '');
                encoded = Buffer.from(auth, 'base64');
                decoded = encoded.toString('utf-8');
                colonPosition = decoded.indexOf(':');
                username = decoded.substr(0, colonPosition);
                password = decoded.substr(colonPosition + 1);
                _context.next = 14;
                return getUserFromCredentialsFunction({
                  username: username,
                  password: password
                });

              case 14:
                user = _context.sent;
                console.log({
                  auth: auth,
                  encoded: encoded,
                  decoded: decoded,
                  colonPosition: colonPosition,
                  username: username,
                  password: password,
                  user: user
                });

                if (user) {
                  _context.next = 18;
                  break;
                }

                throw new HttpError$1({
                  status: 401,
                  message: 'Incorrect Credentials'
                });

              case 18:
                return _context.abrupt("return", user);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }();
  }

  function makeBearerTokenAuthenticator(getUserFromBearerFunction) {
    return /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var headers, token, identity;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = _ref.headers;

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
                return getUserFromBearerFunction(token);

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
        return _ref2.apply(this, arguments);
      };
    }();
  }

  function makeRequestAuthenticator(getUserFromRequest) {
    return /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var identity;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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

  var startingChars = {
    '{': 'json',
    '[': 'json',
    '<': 'xml'
  };
  function parseBody(input) {
    if (!input) return null;
    var inputType = objer.getTypeString(input);

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

      var _iterator = _createForOfIteratorHelper(sections),
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
  }(stream.Writable);

  function getParams(keyList, _ref) {
    var body = _ref.body,
        query = _ref.query;
    var missing = [];
    var data = {};

    var _iterator = _createForOfIteratorHelper(keyList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;

        if (body !== null && body !== void 0 && body[key]) {
          data[key] = body[key];
        } else if (query !== null && query !== void 0 && query[key]) {
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


  function responseWrapper(func, config) {
    return /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
        var body, params, _getParams, missing, data, _getParams2, _missing, _data, endpointResponse;

        return regeneratorRuntime.wrap(function _callee$(_context) {
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
                params = {
                  request: request,
                  response: response,
                  body: config.noParse ? undefined : request.body,
                  query: request.query,
                  headers: request.headers
                };

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

                if (!response._headerSent) {
                  if (typeof endpointResponse === 'string') {
                    response.send(endpointResponse);
                  } else {
                    response.json(endpointResponse);
                  }
                }

                _context.next = 31;
                break;

              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](0);
                applyHttpError(request, response, _context.t0);

              case 31:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 28]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();
  }

  var Router = /*#__PURE__*/function () {
    function Router(expressApp, parent, baseDirectory) {
      var _this = this;

      _classCallCheck(this, Router);

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
        var subRouter = new Router(_this.expressApp, _this, _this.getSubPath(subdirectory));
        subRouter.setAuthenticator(_this.authenticator);

        _this.describeSubroute(subdirectory, {
          subrouter: subRouter
        });

        return subRouter;
      });

      _defineProperty(this, "getResponseWrapper", function (callback) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (_this.authenticator && !config.authenticator) {
          config.authenticator = _this.authenticator;
        }

        return responseWrapper(callback, config);
      });

      _defineProperty(this, "makeRouteDetails", function (type, route, config, callback) {
        _this.describeSubroute(route, _defineProperty({}, type, config));

        var params = [_this.getSubPath(route)];

        if (config !== null && config !== void 0 && config.middleware) {
          params = params.concat(config.middleware);
        }

        params.push(_this.getResponseWrapper(callback, config));
        return params;
      });

      _defineProperty(this, "get", function (route, config, callback) {
        var _this$expressApp;

        return (_this$expressApp = _this.expressApp).get.apply(_this$expressApp, _toConsumableArray(_this.makeRouteDetails('get', route, config, callback)));
      });

      _defineProperty(this, "post", function (route, config, callback) {
        var _this$expressApp2;

        return (_this$expressApp2 = _this.expressApp).post.apply(_this$expressApp2, _toConsumableArray(_this.makeRouteDetails('post', route, config, callback)));
      });

      _defineProperty(this, "put", function (route, config, callback) {
        var _this$expressApp3;

        return (_this$expressApp3 = _this.expressApp).put.apply(_this$expressApp3, _toConsumableArray(_this.makeRouteDetails('put', route, config, callback)));
      });

      _defineProperty(this, "patch", function (route, config, callback) {
        var _this$expressApp4;

        return (_this$expressApp4 = _this.expressApp).patch.apply(_this$expressApp4, _toConsumableArray(_this.makeRouteDetails('patch', route, config, callback)));
      });

      _defineProperty(this, "delete", function (route, config, callback) {
        var _this$expressApp5;

        return (_this$expressApp5 = _this.expressApp)["delete"].apply(_this$expressApp5, _toConsumableArray(_this.makeRouteDetails('delete', route, config, callback)));
      });

      _defineProperty(this, "options", function (route, config, callback) {
        var _this$expressApp6;

        return (_this$expressApp6 = _this.expressApp).options.apply(_this$expressApp6, _toConsumableArray(_this.makeRouteDetails('options', route, config, callback)));
      });

      _defineProperty(this, "any", function (route, config, callback) {
        var _this$expressApp7, _this$expressApp8, _this$expressApp9, _this$expressApp10, _this$expressApp11, _this$expressApp12;

        var params = _this.makeRouteDetails('any', route, config, callback);

        return [(_this$expressApp7 = _this.expressApp).get.apply(_this$expressApp7, _toConsumableArray(params)), (_this$expressApp8 = _this.expressApp).put.apply(_this$expressApp8, _toConsumableArray(params)), (_this$expressApp9 = _this.expressApp).post.apply(_this$expressApp9, _toConsumableArray(params)), (_this$expressApp10 = _this.expressApp).patch.apply(_this$expressApp10, _toConsumableArray(params)), (_this$expressApp11 = _this.expressApp)["delete"].apply(_this$expressApp11, _toConsumableArray(params)), (_this$expressApp12 = _this.expressApp).options.apply(_this$expressApp12, _toConsumableArray(params))];
      });

      _defineProperty(this, "use", function () {
        var _this$expressApp13;

        (_this$expressApp13 = _this.expressApp).use.apply(_this$expressApp13, arguments);
      });

      _defineProperty(this, "applyRoutes", function (routes) {
        var _iterator = _createForOfIteratorHelper(routes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var route = _step.value;
            var path = route.path,
                executor = route.executor,
                get = route.get,
                options = route.options,
                deleteRoute = route["delete"],
                patch = route.patch,
                post = route.post,
                put = route.put,
                subrouter = route.subrouter;
            if (executor) _this.any(path, executor.config, executor.callback);
            if (get) _this.get(path, get.config, get.callback);
            if (post) _this.post(path, post.config, post.callback);
            if (options) _this.options(path, options.config, options.callback);
            if (patch) _this.patch(path, patch.config, patch.callback);
            if (put) _this.put(path, put.config, put.callback);
            if (deleteRoute) _this["delete"](path, deleteRoute.config, deleteRoute.callback);

            if (subrouter) {
              var sub = _this.subrouter(path);

              sub.applyRoutes(subrouter);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });

      _defineProperty(this, "enableCors", function () {
        var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
        var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

        _this.expressApp.use(function (req, res, next) {
          res.header('Access-Control-Allow-Origin', origin);
          res.header('Access-Control-Allow-Headers', headers);
          next();
        });

        _this.expressApp.options('*', function (request, result) {
          return result.status(200).send();
        });
      });

      _defineProperty(this, "close", function () {
        if (_this.connection) {
          _this.connection.close();
        }
      });

      _defineProperty(this, "listen", function (port, callback) {
        _this.connection = _this.expressApp.listen(port, function (results) {
          console.log('listening on port', port);
          callback === null || callback === void 0 ? void 0 : callback(results);
        });
        _this.connection.keepAliveTimeout = 60 * 1000;
        _this.connection.headersTimeout = 61 * 1000;
      });

      this.parent = parent;
      this.expressApp = expressApp || express();
      this.baseDirectory = baseDirectory;
      this.routes = {};
    }

    _createClass(Router, [{
      key: "expressApp",
      value: function expressApp() {
        return this.expressApp;
      }
    }, {
      key: "expressConnection",
      value: function expressConnection() {
        return this.expressConnection;
      }
    }]);

    return Router;
  }();

  function makeEndpoint(config, executionFunction) {
    return {
      config: config,
      callback: executionFunction
    };
  }

  exports.HttpError = HttpError$1;
  exports.Router = Router;
  exports.makeBasicAuthenticator = makeBasicAuthenticator;
  exports.makeBearerTokenAuthenticator = makeBearerTokenAuthenticator;
  exports.makeEndpoint = makeEndpoint;
  exports.makeHardcodedBasicAuthenticator = makeHardcodedBasicAuthenticator;
  exports.makeRequestAuthenticator = makeRequestAuthenticator;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
