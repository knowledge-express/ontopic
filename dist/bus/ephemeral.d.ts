import { Quad } from '../data';
import { MutableBus, Mutation } from '.';
import { Subject } from './observable';
export declare function create(updater?: (subject: Subject<Mutation<Quad[]>>) => void): MutableBus<Quad[]>;
declare const _default: {
    create: typeof create;
};
export default _default;
