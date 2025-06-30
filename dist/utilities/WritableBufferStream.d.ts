import { Writable, WritableOptions } from 'stream';
export declare class WritableBufferStream extends Writable {
    buffer: Buffer;
    private callback;
    constructor(callback: (buffer: Buffer) => void, options?: WritableOptions);
    _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
}
//# sourceMappingURL=WritableBufferStream.d.ts.map