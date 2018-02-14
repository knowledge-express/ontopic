import Ontology from './ontology';
import Bus from './bus';
import Store from './store';
import { Encoder, Quad } from './data';
export declare type Config<V> = {
    encoder: Encoder<V, Quad[]>;
    busses: Bus<V>[];
    stores: Store<V>[];
};
export declare module Config {
    const Default: Config<Quad[]>;
    function ontology<V>(config: Config<V>, ontology: Ontology): Config<V>;
    function bus<V>(config: Config<V>, bus: Bus<V>): Config<V>;
    function store<V>(config: Config<V>, store: Store<V>): Config<V>;
}
export default Config;
