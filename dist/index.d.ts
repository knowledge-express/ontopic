import Config from './config';
import Bus from './bus';
import Store from './store';
export declare type ontopic = {
    config: Config;
    store: () => void;
    bus: () => void;
    graphql: () => void;
    start: () => void;
};
export declare function ontopic(config?: Config): ontopic;
export declare module ontopic {
    function create(config: Config): ontopic;
    function bus(ontop: ontopic, bus: Bus): ontopic;
    function store(ontop: ontopic, store: Store<any>): ontopic;
    function graphql(ontop: ontopic): ontopic;
    function start(ontop: ontopic): void;
}
export default ontopic;
export * from './config';
export * from './ontology';
export * from './bus';
export * from './store';
