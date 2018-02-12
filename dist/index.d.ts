import Config from './config';
import Bus from './bus';
import Store from './store';
export declare type ontopic<V> = {
    bus: Bus<V>;
    store: Store<V>;
};
export declare function ontopic<V>(config?: Config<V>): ontopic<V>;
export declare module ontopic {
    function create<V>(config: Config<V>): ontopic<V>;
}
export default ontopic;
export * from './config';
export * from './ontology';
export * from './bus';
export * from './store';
