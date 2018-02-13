import { Quad } from '../data';
import { MutableBus } from '.';
export declare type Graph = {
    add: (triple: object) => void;
    remove: (triple: object) => void;
    toArray: () => any[];
};
export declare function create(): MutableBus<Quad[]>;
declare const _default: {
    create: typeof create;
};
export default _default;
