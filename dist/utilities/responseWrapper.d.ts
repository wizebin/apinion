import { Request, Response } from 'express';
import { EndpointConfig, EndpointExecutor } from './makeEndpoint';
interface ApinionRouter {
    onError?: (params: {
        error: Error;
        config?: any;
        request: Request;
        response: Response;
        [key: string]: any;
    }) => void | Promise<void>;
}
export declare function responseWrapper(func: EndpointExecutor | EndpointConfig, config?: EndpointConfig, apinionRouter?: ApinionRouter, type?: string): (request: Request, response: Response, extras?: any) => Promise<void>;
export {};
//# sourceMappingURL=responseWrapper.d.ts.map