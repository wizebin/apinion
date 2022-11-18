export class WritableBufferStream extends Writable {
    constructor(callback: any, options: any);
    buffer: Buffer;
    callback: any;
}
import { Writable } from "stream";
