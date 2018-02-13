import { Observable, Subject } from './observable';
import Query from '../query';
export declare type Mutation<V> = {
    action: 'add' | 'remove';
    data: V;
};
export declare type ReadableBus<V> = {
    observable: Observable<Mutation<V>>;
};
export declare type MutableBus<V> = ReadableBus<V> & {
    subject: Subject<Mutation<V>>;
};
export declare type Bus<V> = ReadableBus<V> | MutableBus<V>;
export declare module Bus {
    function isBus<V>(obj: object): obj is Bus<V>;
    function isReadableBus<V>(obj: object): obj is ReadableBus<V>;
    function isMutableBus<V>(obj: object): obj is MutableBus<V>;
    function readOnly<V>(bus: Bus<V>): ReadableBus<V>;
    function query<V>(bus: Bus<V>, query: Query): void;
}
export default Bus;
