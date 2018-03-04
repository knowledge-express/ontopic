import { MutableBus } from '.';
import { Subject } from './observable';
export declare function create<V>(updater?: (subject: Subject<V>) => void): MutableBus<V>;
declare const _default: {
    create: <V>(updater?: (subject: Subject<V>) => void) => MutableBus<V>;
};
export default _default;
