import Config from './config';
import * as Bus from './bus';
import * as Store from './store';
import * as Data from './data';
export declare type ontopic<V> = {
    bus: Bus.Bus<Data.Mutation<V>>;
    store: Store.Store<V>;
};
export declare function ontopic(): ontopic<Data.Quad[]>;
export declare function ontopic(config?: Config<Data.Quad[]>): ontopic<Data.Quad[]>;
export declare function ontopic<V>(config: Config<V>): ontopic<V>;
export declare module ontopic {
    function fromConfig<V>(config?: Config<V>): ontopic<V>;
    function create<V>(encoder: Data.Encoder<Data.Quad[], V>): ontopic<V>;
    function connect<V>(store: Store.MutableStore<V>, bus: Bus.MutableBus<Data.Mutation<V>>): ontopic<V>;
}
export default ontopic;
export * from './config';
export * from './ontology';
export * from './data';
export { Bus, Store };
