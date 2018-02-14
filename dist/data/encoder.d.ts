import { Quad, JSONLD } from '.';
export declare type Encoder<V, W> = {
    encode: (data: V) => W | Promise<W>;
    decode: (encoded: W) => V | Promise<V>;
};
export declare module Encoder {
    function Identity<V>(): Encoder<V, V>;
    function JSONLDToQuads(): Encoder<JSONLD, Quad[]>;
    const quadsToJSONLD: () => Encoder<Quad[], JSONLD>;
    function invert<X, Y>(encoder: Encoder<X, Y>): Encoder<Y, X>;
    function compose<X, Y, Z>(a: Encoder<X, Y>, b: Encoder<Y, Z>): Encoder<X, Z>;
}
export default Encoder;
