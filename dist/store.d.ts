export declare type StoreConfig = {
    mutable: boolean;
};
export declare type ReadableStore<V> = {
    query: <V>(query) => V;
};
export declare module ReadableStore {
    function isReadableStore<V>(store: object): store is ReadableStore<V>;
    function query<V>(store: ReadableStore<V>, query: any): any;
}
export declare type MutableStore<V> = {
    add: (data: V) => V;
    remove: (data: V) => V;
};
export declare module MutableStore {
    function isMutableStore<V>(store: object): store is MutableStore<V>;
    function add<V>(store: MutableStore<V>, data: any): any;
    function remove<V>(store: MutableStore<V>, data: any): any;
}
export declare type Store<V> = ReadableStore<V> | (ReadableStore<V> & MutableStore<V>);
export declare module Store {
    function create<V>(config: StoreConfig): Store<V>;
    function isStore<V>(obj: object): obj is Store<V>;
}
export default Store;
