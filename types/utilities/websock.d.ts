export class wsRequest {
}
export class wsResponse {
    constructor(request: any, socket: any, configuration: any);
    /**
     * @type {import('net').Socket}
     */
    sock: import("net").Socket;
    status(code: any): this;
    statusCode: any;
    getHeadersString(): void;
    send(data: any): void;
    _headerSent: boolean;
    json(data: any): void;
    _implicitHeader(): void;
}
