import { Store, ReadableStore } from '.';
export declare type CompositeStore = ReadableStore;
export declare module CompositeStore {
    function create<V>(stores: Store<V>[]): CompositeStore;
    function getPropertyValue(stores: ReadableStore[], id: any, property: any): Promise<string | object | string[] | object[]>;
    function findBy(stores: any, types: any, predicate: any, value: any): Promise<string | object | string[] | object[]>;
}
export default CompositeStore;
