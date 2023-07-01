export function stringifyError(error: any): string;
export function applyHttpError(request: any, response: any, error: any): void;
export class HttpError {
    constructor({ status, message, data }: {
        status: any;
        message: any;
        data: any;
    });
    name: string;
    status: any;
    message: any;
    data: any;
}
