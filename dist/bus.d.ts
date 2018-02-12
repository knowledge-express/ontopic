export declare type ReadableBus<V> = {
    observable;
};
export declare type MutableBus<V> = ReadableBus<V> & {
    subject;
};
export declare type Bus<V> = ReadableBus<V> | MutableBus<V>;
export declare module Bus {
    function isBus<V>(obj: object): obj is Bus<V>;
    function isReadableBus<V>(obj: object): obj is ReadableBus<V>;
    function isMutableBus<V>(obj: object): obj is MutableBus<V>;
    function readOnly<V>(bus: Bus<V>): ReadableBus<V>;
}
export default Bus;
