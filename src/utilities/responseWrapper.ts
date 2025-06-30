import { Request, Response } from 'express';
import { applyHttpError, HttpError } from './HttpError';
import { parseBody } from './parseBody';
import { WritableBufferStream } from './WritableBufferStream';
import { EndpointConfig, EndpointExecutor } from './makeEndpoint';

interface ParamsData {
  missing: string[];
  data: Record<string, any>;
}

interface ApinionRouter {
  onError?: (params: {
    error: Error;
    config?: any;
    request: Request;
    response: Response;
    [key: string]: any;
  }) => void | Promise<void>;
}

function getParams(keyList: string[], { body, query }: { body?: any; query?: any }): ParamsData {
  const missing: string[] = [];
  const data: Record<string, any> = {};
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

function collectBody(request: Request): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const output = new WritableBufferStream(resolve);
    output.on('error', reject);
    request.pipe(output);
  });
}

/**
 * Wraps an endpoint function with request/response handling
 */
export function responseWrapper(
  func: EndpointExecutor | EndpointConfig,
  config?: EndpointConfig,
  apinionRouter?: ApinionRouter,
  type?: string
): (request: Request, response: Response, extras?: any) => Promise<void> {
  let actualFunc: EndpointExecutor;
  let actualConfig: EndpointConfig;

  if (typeof func !== 'function') {
    if (typeof config === 'function') {
      actualFunc = config as any;
      actualConfig = {};
      // we COULD throw here, but it's perhaps better to just let people do what they want
    } else {
      throw new Error('endpoint executor must be a function check config (this happens when you use makeEndpoint inside of a get/post/any, or if you forget the config parameter) ' + JSON.stringify(config));
    }
  } else {
    actualFunc = func;
    actualConfig = config || {};
  }

  return async (request: Request, response: Response, extras?: any) => {
    try {
      if (!actualConfig.noParse) {
        (request as any).raw = await collectBody(request);
        const body = parseBody((request as any).raw.toString());
        request.body = body;
      }
      const params = { 
        request, 
        response, 
        body: actualConfig.noParse ? undefined : request.body, 
        query: request.query, 
        headers: request.headers, 
        params: Object.assign({}, request.query || {}, request.body || {}), 
        ...extras 
      };
      
      if (actualConfig.authenticator) {
        (params as any).identity = await actualConfig.authenticator(params);
      }
      
      if (actualConfig.required) {
        const { missing, data } = getParams(actualConfig.required, params);

        if (missing.length > 0) {
          throw new HttpError({ status: 400, message: `missing params: ${missing.map(item => `"${item}"`).join(', ')}` });
        }

        (params as any).required = data;
      }
      
      if (actualConfig.hidden_required) {
        const { missing, data } = getParams(actualConfig.hidden_required, params);

        if (missing.length > 0) {
          throw new HttpError({ status: 400, message: 'your request is incomplete (this is probably because you are missing some essential hidden requirement)' });
        }

        (params as any).hidden = data;
      }
      
      const endpointResponse = await actualFunc(params as any);

      if (type === 'upgrade') {
        // upgrade requests should not have information automatically sent to the client
      } else {
        if (!(response as any)._headerSent) {
          if (typeof endpointResponse === 'string') {
            response.send(endpointResponse);
          } else {
            response.json(endpointResponse);
          }
        }
      }
    } catch (err: any) {
      try {
        await actualConfig?.onError?.({ error: err, config: actualConfig, request, response, ...extras });
        await apinionRouter?.onError?.({ error: err, config: actualConfig, request, response, ...extras });
      } catch (subError) {
        console.error(`custom error handler threw error (check your onError handler in your ${actualConfig?.route || request.originalUrl} endpoint) (check your apinionRouter.onError function)`, subError);
      }

      if (!(response as any)._headerSent) {
        // this gets tricky with upgrade requests, you can manually set this flag in your config error handler if you want to avoid the extra data
        applyHttpError(request, response, err);
      }
    }
  };
}