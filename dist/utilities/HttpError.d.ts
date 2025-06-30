import { Request, Response } from 'express';
export interface HttpErrorParams {
    status: number;
    message: string;
    data?: any;
}
export declare class HttpError extends Error {
    status: number;
    data?: any;
    constructor({ status, message, data }: HttpErrorParams);
}
export declare function stringifyError(error: any): string;
export declare function applyHttpError(_request: Request, response: Response, error: any): void;
//# sourceMappingURL=HttpError.d.ts.map