import { applyHttpError, HttpError } from './HttpError';
import { parseBody } from './parseBody';

function getParams(keyList, { body, query }) {
  const missing = [];
  const data = {};
  for (let key of keyList) {
    if (body?.[key]) {
      data[key] = body[key];
    } else if (query?.[key]) {
      data[key] = query[key];
    } else {
      missing.push(key);
    }
  }
  return { missing, data };
}

/**
 *
 * @param {function} func
 * @param {{ authenticator: function }} config
 */
export function responseWrapper(func, config) {
  return async (request, response) => {
    try {
      const raw = request.body;
      if (raw) {
        const parsed_body = parseBody(raw.toString());
        request.parsed_body = parsed_body;
      }
      const params = { request, response, body: request.parsed_body, query: request.query, headers: request.headers };
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
      applyHttpError(request, response, err);
    }
  };
}
