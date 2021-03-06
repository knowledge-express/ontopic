import { Quad, JSONLD, Mutation } from '.';

export type Encoder<V, W> = {
  encode: (data: V) => W | Promise<W>
  decode: (encoded: W) => V | Promise<V>
};

export module Encoder {
  export function Identity<V>(): Encoder<V, V> {
    return {
      encode: (data: V) => data,
      decode: (encoded: V) => encoded,
    }
  };

  // export function toAddMutation<V>(): Encoder<V, Mutation<V>> {
  //   return {
  //     encode: (data) => Mutation.add<V>(data),
  //     decode: (encoded) => encoded.data,
  //   }
  // };

  export function JSONLDToQuads(): Encoder<JSONLD, Quad[]> {
    return {
      encode: async (data) => {
        return await JSONLD.toQuads(data);
      },
      decode: async (encoded) => {
        return await JSONLD.fromQuads(encoded);
      }
    };
  };

  export const quadsToJSONLD = () => invert(JSONLDToQuads());

  export function compactJSONLD(context: JSONLD.Context): Encoder<JSONLD, JSONLD> {
    return {
      encode: async (data) => {
        return await JSONLD.compact(data, context);
      },
      decode: async (encoded) => {
        return await JSONLD.expand(encoded, context);
      }
    }
  };

  export function expandJSONLD(context: JSONLD.Context): Encoder<JSONLD, JSONLD> {
    return {
      encode: async (data) => {
        return await JSONLD.expand(data, context);
      },
      decode: async (encoded) => {
        return await JSONLD.compact(encoded, context);
      }
    }
  };

  export function invert<X, Y>(encoder: Encoder<X, Y>): Encoder<Y, X> {
    async function encode(data) {
      return encoder.decode(data);
    }

    async function decode(encoded) {
      return encoder.encode(encoded);
    }

    return {
      encode,
      decode
    }
  };

  export function compose<X, Y, Z>(a: Encoder<X, Y>, b: Encoder<Y, Z>): Encoder<X, Z> {
    async function encode(x: X): Promise<Z> {
      const y = await a.encode(x);
      const z = await b.encode(y);
      return z;
    }

    async function decode(z: Z): Promise<X> {
      const y = await b.decode(z);
      const x = await a.decode(y);
      return x;
    }

    return {
      encode,
      decode
    };
  };
};

export default Encoder;
