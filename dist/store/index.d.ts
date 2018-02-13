import Query from '../query';
export declare type ReadableStore<V> = {
    query: (query: Query) => V | Promise<V>;
    filter: (types: string[], predicate: string, value: string) => V[];
    getValues: (object: string, predicate: string) => string[];
};
export declare type MutableStore<V> = ReadableStore<V> & {
    add: (data: V) => V | Promise<V>;
    remove: (data: V) => V | Promise<V>;
};
export declare type Store<V> = ReadableStore<V> | MutableStore<V>;
export declare module Store {
    function isStore<V>(obj: object): obj is Store<V>;
    function isReadableStore<V>(store: object): store is ReadableStore<V>;
    function isMutableStore<V>(store: object): store is MutableStore<V>;
    function readOnly<V>(store: Store<V>): ReadableStore<V>;
}
export default Store;
