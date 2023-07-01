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

function collectBody(request) {
  return new Promise((resolve, reject) => {
    const output = new WritableBufferStream(resolve);
    output.on('error', reject);
    request.pipe(output);
  });
}

/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func, config, apinionRouter) {
  return async (request, response) => {
    try {
      if (!config.noParse) {
        request.raw = await collectBody(request);
        const body = parseBody(request.raw.toString());
        request.body = body;
      }
      const params = { request, response, body: config.noParse ? undefined : request.body, query: request.query, headers: request.headers, params: Object.assign({}, request.query || {}, request.body || {}) };
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
        await apinionRouter?.onErrorCallback?.({ error: err, config, request, response });
      } catch (subError) {
        console.error(`custom error handler threw error (check your onError handler in your ${config?.route || request.originalUrl} endpoint) (check your apinionRouter.onError function)`, subError);
      }

      if (!response._headerSent) {
        applyHttpError(request, response, err);
      }
    }
  };
}
