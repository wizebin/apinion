import { applyHttpError, HttpError } from './HttpError';
import { parseBody } from './parseBody';
import { WritableBufferStream } from './WritableBufferStream';

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

export function collectBody(request) {
  return new Promise((resolve, reject) => {
    const output = new WritableBufferStream(resolve);
    output.on('error', reject);
    request.pipe(output);
  });
}

/**
 * Gather required input parameters for an authenticator body, useful for implementing auth in websocket upgrade requests
 * @param {{ request: Express.Request, response: Express.Response }} requestDetails
 * @returns {Promise<{ request: Express.Request, response: Express.Response, body: object, query: object, headers: object, params: object }>}
 */
export async function gatherAuthParams({ request, response = {}, config = {} }) {
  request.raw = await collectBody(request);
  const body = parseBody(request.raw.toString());
  request.body = body;

  return {
    request,
    response,
    body: config.noParse ? undefined : request.body,
    query: request.query,
    headers: request.headers,
    params: Object.assign({}, request.query || {}, request.body || {})
  };
}

/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func, config, apinionRouter) {
  if (typeof func !== 'function') {
    if (typeof config === 'function') {
      func = config;
      config = {};

      // we COULD throw here, but it's perhaps better to just let people do what they want
    } else {
      throw new Error('endpoint executor must be a function check config (this happens when you use makeEndpoint inside of a get/post/any, or if you forget the config parameter) ' + JSON.stringify(config));
    }
  }

  return async (request, response) => {
    try {
      const params = await gatherAuthParams({ request, response, config });

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
      if (!response._headerSent) {
        if (typeof endpointResponse === 'string') {
          response.send(endpointResponse);
        } else {
          response.json(endpointResponse);
        }
      }
    } catch (err) {
      try {
        await config?.onError?.({ error: err, config, request, response });
        await apinionRouter?.onError?.({ error: err, config, request, response });
      } catch (subError) {
        console.error(`custom error handler threw error (check your onError handler in your ${config?.route || request.originalUrl} endpoint) (check your apinionRouter.onError function)`, subError);
      }

      if (!response._headerSent) {
        applyHttpError(request, response, err);
      }
    }
  };
}
