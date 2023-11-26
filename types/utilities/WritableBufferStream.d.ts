export class WritableBufferStream extends Writable {
    constructor(callback: any, options: any);
    buffer: Buffer;
    callback: any;
    _write(chunk: any, encoding: any, callback: any): void;
    _final(callback: any): void;
    _destroy(): void;
}
import { Writable } from 'stream';
