import { Quad } from '../data';
import { MutableBus } from '.';
import { Subject } from './observable';
export declare function create(updater?: (subject: Subject<Quad[]>) => void): MutableBus<Quad[]>;
declare const _default: {
    create: typeof create;
};
export default _default;
