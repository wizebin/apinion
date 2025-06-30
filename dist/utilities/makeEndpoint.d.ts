import { Request, Response } from 'express';
export interface EndpointConfig {
    required?: string[];
    hidden_required?: string[];
    authenticator?: (params: {
        request: Request;
        response: Response;
        body: any;
        query: any;
        headers: any;
        params: any;
    }) => any | Promise<any>;
    noParse?: boolean;
    onError?: (params: {
        request: Request;
        response: Response;
        error: Error;
        [key: string]: any;
    }) => void | Promise<void>;
    route?: string;
}
export interface EndpointParams {
    request: Request;
    response: Response;
    identity?: any;
    body: any;
    query: any;
    headers: any;
    params: any;
    required?: Record<string, any>;
    hidden?: Record<string, any>;
    [key: string]: any;
}
export type EndpointExecutor = (params: EndpointParams) => any | Promise<any>;
export interface Endpoint {
    config: EndpointConfig;
    callback: EndpointExecutor;
}
export declare function makeEndpoint(config: EndpointConfig, executionFunction: EndpointExecutor): Endpoint;
//# sourceMappingURL=makeEndpoint.d.ts.map