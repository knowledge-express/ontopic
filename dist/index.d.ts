import Config from './config';
import * as Bus from './bus';
import * as Store from './store';
import { Quad, Encoder } from './data';
export declare type ontopic<V> = {
    bus: Bus.Bus<V>;
    store: Store.Store<V>;
};
export declare function ontopic(): ontopic<Quad[]>;
export declare function ontopic(config?: Config<Quad[]>): ontopic<Quad[]>;
export declare function ontopic<V>(config: Config<V>): ontopic<V>;
export declare module ontopic {
    function fromConfig<V>(config?: Config<V>): ontopic<V>;
    function create<V>(encoder: Encoder<V, Quad[]>): ontopic<V>;
    function connect<V>(store: Store.MutableStore<V>, bus: Bus.MutableBus<V>): ontopic<V>;
}
export default ontopic;
export * from './config';
export * from './ontology';
export { Bus, Store };
