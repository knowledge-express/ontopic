import { MutableBus } from '.';
import { Subject } from './observable';
export declare function create<V>(updater?: (subject: Subject<V>) => void): MutableBus<V>;
declare const _default: {
    create: typeof create;
};
export default _default;
