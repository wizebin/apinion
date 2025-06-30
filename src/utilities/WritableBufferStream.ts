import { Writable, WritableOptions } from 'stream';

export class WritableBufferStream extends Writable {
  buffer: Buffer = Buffer.alloc(0);
  private callback: (buffer: Buffer) => void;

  constructor(callback: (buffer: Buffer) => void, options?: WritableOptions) {
    super(options);
    this.callback = callback;
  }

  _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    if (chunk) {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    }

    callback();
  }

  _final(callback: (error?: Error | null) => void): void {
    this.callback(this.buffer);
    callback();
  }

  _destroy(error: Error | null, callback: (error?: Error | null) => void): void {
    this.buffer = Buffer.alloc(0);
    if (callback) {
      callback(error);
    }
  }
}