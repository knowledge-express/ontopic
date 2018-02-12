export declare type Query = object;
export declare type ReadableStore<V> = {
    query: (query: Query) => V | Promise<V>;
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
    type MapFn<V, W> = (v: V) => W | Promise<W>;
    function map<V, W>(store: Store<V>, mapFn: MapFn<V, W>): Store<W>;
}
export default Store;
