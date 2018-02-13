import Store from './store';
export declare type Ontology = {
    store: Store<any>;
};
export declare module Ontology {
    function fromString(str: string): Ontology;
}
export default Ontology;
