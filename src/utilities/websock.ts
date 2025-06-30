import * as http from 'http';
import { Socket } from 'net';

export class wsRequest extends http.IncomingMessage {
  constructor() {
    super({} as any);
  }
}

export class wsResponse extends http.OutgoingMessage {
  public sock: Socket;
  public statusCode: number;
  public _headerSent: boolean = false;

  constructor(_request: http.IncomingMessage, socket: Socket, _configuration?: any) {
    super();
    this.sock = socket;

    // Handle internal socket symbol
    const socketSymbol = Symbol.for('kSocket');
    if (!(this as any)[socketSymbol]) {
      (this as any)[socketSymbol] = socket;
    }
    
    this.statusCode = 200;
  }

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  getHeadersString(): void {
    // Method implementation if needed
  }

  send(data: any): void {
    if (!this.sock || this.sock.destroyed) {
      return;
    }

    this.status(this.statusCode || 200);
    if ((this as any)._header) {
      this.sock.write((this as any)._header);
    } else {
      this.sock.write('HTTP/1.1 ' + this.statusCode + ' ' + http.STATUS_CODES[this.statusCode] + '\r\n');
    }

    this.sock.write('\r\n');
    if (data instanceof Buffer || typeof data === 'string') {
      this.sock.write(data);
    } else {
      this.sock.write(JSON.stringify(data));
    }
    this.sock.end();
    this._headerSent = true;

    // unsure why this doesn't work :/
    // for now let's stick with direct socket writing and move on with our lives

    // this.status(this.statusCode || 200);
    // if (data instanceof Buffer || typeof data === 'string') {
    //   this.end(data); // same as this.write then this.end
    // } else if (typeof data === 'object') {
    //   this.end(JSON.stringify(data)); // same as this.write then this.end
    // } else {
    //   this.end(`${data}`);
    // }
  }

  json(data: any): void {
    this.send(JSON.stringify(data));
  }

  _implicitHeader(): void {
    if ((this as any)._header) {
      return;
    }

    const method = (this as any).method || 'GET';
    const path = (this as any).path || '/';
    const kOutHeaders = Symbol.for('kOutHeaders');
    
    (this as any)._storeHeader(
      method + ' ' + path + ' HTTP/1.1\r\n',
      (this as any)[kOutHeaders]
    );
  }
}