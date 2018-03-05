import { Observable, Subject } from './observable';
import { Encoder, Mutation } from '../data';
import * as EphemeralBus from './ephemeral';
export * from './observable';
export { EphemeralBus };
export declare type ReadableBus<V> = {
    observable: Observable<V>;
};
export declare type MutableBus<V> = ReadableBus<V> & {
    subject: Subject<V>;
};
export declare type Bus<V> = ReadableBus<V> | MutableBus<V>;
export declare function isBus<V>(obj: object): obj is Bus<V>;
export declare function isReadableBus<V>(obj: object): obj is ReadableBus<V>;
export declare function isMutableBus<V>(obj: object): obj is MutableBus<V>;
export declare function readOnly<V>(bus: Bus<V>): ReadableBus<V>;
export declare function map<V, W>(bus: Bus<V>, mapFn: (v: V) => W | Promise<W>): Bus<W>;
export declare function filter<V>(bus: Bus<V>, filterFn: (v: V) => boolean | Promise<boolean>): Bus<V>;
export declare function flatten<V>(bus: Bus<V[]>): Bus<V>;
export declare function zip<V, W>(bus: Bus<V>, other: Bus<W>): Bus<[V, W]>;
export declare function encode<V, W>(bus: Bus<Mutation<V>>, encoder: Encoder<V, W>): Bus<Mutation<W>>;
export default Bus;
