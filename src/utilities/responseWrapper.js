import { applyHttpError, HttpError } from './HttpError';
import { getTypeString } from './getTypeString';
import { parseBody } from './parseBody';
import { WritableBufferStream } from './WritableBufferStream';

const EMPTY_BUFFER = Buffer.alloc(0);

function getParams(keyList, { body, query }) {
  const missing = [];
  const data = {};
  for (let key of keyList) {
    if (body?.[key] !== undefined) {
      data[key] = body[key];
    } else if (query?.[key] !== undefined) {
      data[key] = query[key];
    } else {
      missing.push(key);
    }
  }
  return { missing, data };
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    const output = new WritableBufferStream(resolve);
    output.on('error', reject);
    request.pipe(output);
  });
}

// Whether some middleware already owns request.body outright, in which case we
// neither re-read the stream nor merge anything into what it produced.
function bodyIsFinal(request) {
  if (request.readableEnded === true) return true;

  return request._body === true;
}

function combineBodies(parsedBody, middlewareBody) {
  if (middlewareBody === undefined || middlewareBody === null) return parsedBody;
  if (parsedBody === undefined || parsedBody === null) return middlewareBody;

  if (getTypeString(parsedBody) === 'object' && getTypeString(middlewareBody) === 'object') {
    return Object.assign({}, parsedBody, middlewareBody);
  }

  return middlewareBody;
}

function defaultedBody(body) {
  if (body === undefined || body === null) return {};
  return body;
}

/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func, config, apinionRouter, type) {
  if (typeof func !== 'function') {
    if (typeof config === 'function') {
      func = config;
      config = {};

      // we COULD throw here, but it's perhaps better to just let people do what they want
    } else {
      throw new Error('endpoint executor must be a function check config (this happens when you use makeEndpoint inside of a get/post/any, or if you forget the config parameter) ' + JSON.stringify(config));
    }
  }

  return async (request, response, extras) => {
    try {
      if (!config.noParse) {
        if (bodyIsFinal(request)) {
          if (request.raw === undefined) request.raw = EMPTY_BUFFER;
        } else {
          request.raw = await collectBody(request);
          const body = parseBody(request.raw.toString());
          request.body = combineBodies(body, request.body);
        }
      }
      const params = { request, response, body: config.noParse ? {} : defaultedBody(request.body), query: request.query, headers: request.headers, params: Object.assign({}, request.query || {}, request.body || {}), ...extras };
      if (config.authenticator) {
        params.identity = await config.authenticator(params);
      }
      if (config.required) {
        const { missing, data } = getParams(config.required, params);

        if (missing.length > 0) {
          throw new HttpError({ status: 400, message: `missing params: ${missing.map(item => `"${item}"`).join(', ')}` });
        }

        params.required = data;
      }
      if (config.hidden_required) {
        const { missing, data } = getParams(config.hidden, params);

        if (missing.length > 0) {
          throw new HttpError({ status: 400, message: 'your request is incomplete (this is probably because you are missing some essential hidden requirement)' });
        }

        params.hidden = data;
      }
      const endpointResponse = await func(params);

      if (type === 'upgrade') {
        // upgrade requests should not have information automatically sent to the client
      } else {
        if (!response._headerSent) {
          if (typeof endpointResponse === 'string') {
            response.send(endpointResponse);
          } else {
            response.json(endpointResponse);
          }
        }
      }
    } catch (err) {
      try {
        await config?.onError?.({ error: err, config, request, response, ...extras });
        await apinionRouter?.onError?.({ error: err, config, request, response, ...extras });
      } catch (subError) {
        console.error(`custom error handler threw error (check your onError handler in your ${config?.route || request.originalUrl} endpoint) (check your apinionRouter.onError function)`, subError);
      }

      if (!response._headerSent) {
        // this gets tricky with upgrade requests, you can manually set this flag in your config error handler if you want to avoid the extra data
        applyHttpError(request, response, err);
      }
    }
  };
}
