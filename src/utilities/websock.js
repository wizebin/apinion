import http from 'http';

export class wsRequest extends http.IncomingMessage {
  constructor() {
    super();
  }
}

export class wsResponse extends http.OutgoingMessage {
  constructor(request, socket, configuration) {
    super(request, configuration);
    /**
     * @type {import('net').Socket}
     */
    this.sock = socket;

    if (!this[Symbol('kSocket')]) {
      this[Symbol('kSocket')] = socket;
    }
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  getHeadersString() {

  }

  send(data) {
    if (!this.sock || this.sock?.destroyed) {
      return;
    }

    this.status(this.statusCode || 200);
    if (this._header) {
      this.sock.write(this._header);
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

  json(data) {
    this.send(JSON.stringify(data));
  }

  _implicitHeader() {
    if (this._header) {
      return;
    }

    this._storeHeader(this.method + ' ' + this.path + ' HTTP/1.1\r\n',
                      this[Symbol('kOutHeaders')]);
  }
}
