export type ReadableBus<V> = {
  observable
};

export type MutableBus<V> = ReadableBus<V> & {
  subject
};

export type Bus<V> = ReadableBus<V> | MutableBus<V>;

export module Bus {
  export function isBus<V>(obj: object): obj is Bus<V> {
    // Every bus should be readable, but nevermind the fallback
    return isReadableBus(obj) || isMutableBus(obj);
  };

  export function isReadableBus<V>(obj: object): obj is ReadableBus<V> {
    return typeof obj === 'object' && 'observable' in obj;
  };

  export function isMutableBus<V>(obj: object): obj is MutableBus<V> {
    return isReadableBus<V>(obj) && 'observable' in obj;
  };

  export function readOnly<V>(bus: Bus<V>): ReadableBus<V> {
    return {
      observable: bus.observable
    };
  };
};

export default Bus;
