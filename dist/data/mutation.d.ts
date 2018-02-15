import { MutableStore } from '../store';
export declare type Mutation<V> = {
    action: 'add' | 'remove';
    data: V;
};
export declare module Mutation {
    function isMutation<V>(obj: object): obj is Mutation<V>;
    function add<V>(data: V): Mutation<V>;
    function remove<V>(data: V): Mutation<V>;
    function apply<V>(mutation: Mutation<V>, store: MutableStore<V>): Promise<Mutation<V>>;
    function map<V, W>(mutation: Mutation<V>, mapFn: (v: V) => W | Promise<W>): Promise<Mutation<W>>;
}
export default Mutation;
