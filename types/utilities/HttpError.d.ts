export function applyHttpError(request: any, response: any, error: any): void;
export class HttpError {
    constructor({ status, message }: {
        status: any;
        message: any;
    });
    name: string;
    status: any;
    message: any;
}
