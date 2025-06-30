import * as http from 'http';
import { Socket } from 'net';
export declare class wsRequest extends http.IncomingMessage {
    constructor();
}
export declare class wsResponse extends http.OutgoingMessage {
    sock: Socket;
    statusCode: number;
    _headerSent: boolean;
    constructor(_request: http.IncomingMessage, socket: Socket, _configuration?: any);
    status(code: number): this;
    getHeadersString(): void;
    send(data: any): void;
    json(data: any): void;
    _implicitHeader(): void;
}
//# sourceMappingURL=websock.d.ts.map