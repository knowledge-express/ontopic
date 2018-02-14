import { Encoder } from '../data';
import Query from '../query';
export declare type ReadableStore<V> = {
    query: (query: Query) => V | Promise<V>;
    filter: (types: string[], predicate: string, value: string) => V[] | Promise<V[]>;
    getValues: (object: string, predicate: string) => string[] | Promise<string[]>;
};
export declare type MutableStore<V> = ReadableStore<V> & {
    add: (data: V) => V | Promise<V>;
    remove: (data: V) => V | Promise<V>;
};
export declare type Store<V> = ReadableStore<V> | MutableStore<V>;
export declare function isStore<V>(obj: object): obj is Store<V>;
export declare function isReadableStore<V>(store: object): store is ReadableStore<V>;
export declare function isMutableStore<V>(store: object): store is MutableStore<V>;
export declare function readOnly<V>(store: Store<V>): ReadableStore<V>;
export declare function encode<V, W>(store: MutableStore<V>, encoder: Encoder<W, V>): MutableStore<W>;
export default Store;
