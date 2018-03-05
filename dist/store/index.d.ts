import { Encoder } from '../data';
export * from './composite';
export declare type ReadableStore = {
    getPropertyValue(id: string, property: string): string | object | string[] | object[];
    findBy(types: string[], property: string, value: string): string | object | string[] | object[];
};
export declare type MutableStore<V> = ReadableStore & {
    add: (data: V) => V | Promise<V>;
    remove: (data: V) => V | Promise<V>;
};
export declare type Store<V> = ReadableStore | MutableStore<V>;
export declare function isStore<V>(obj: object): obj is Store<V>;
export declare function isReadableStore(store: object): store is ReadableStore;
export declare function isMutableStore<V>(store: object): store is MutableStore<V>;
export declare function readOnly<V>(store: Store<V>): ReadableStore;
export declare function encode<V, W>(store: MutableStore<V>, encoder: Encoder<V, W>): MutableStore<W>;
export default Store;
