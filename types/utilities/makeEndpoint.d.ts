import type express from 'express';

export type BaseEndpointParams<T> = {
  params: T;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, any>;
  request: express.Request;
  response: express.Response;
}

export type EndpointParams<T, ID> = BaseEndpointParams<T> & {
  identity: ID | null;
}

export type EndpointAuthenticator<T, ID> = (params: EndpointParams<T, ID>) => Promise<(ID | null)> | (ID | null);

export type EndpointOptions<T, ID> = {
  required?: (keyof T)[];
  hidden_required?: (keyof T)[];
  optional?: (keyof T)[];
  noParse?: boolean;
  onError?: (params: { request: express.Request, response: express.Response, error: Error }) => void;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  authenticator?: EndpointAuthenticator<T, ID>;
}

export type EndpointHandler<T, ID> = (params: EndpointParams<T, ID>) => Promise<any>;

export function makeEndpoint<T = any, ID = any>(options: EndpointOptions<T, ID>, handler: EndpointHandler<T, ID>): any;
