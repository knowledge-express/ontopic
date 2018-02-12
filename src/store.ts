const rdf = require('rdf');

export type StoreConfig = {
  mutable: boolean;
};

export type ReadableStore<V> = {
  query: <V>(query) => V;

};

export module ReadableStore  {
  export function isReadableStore<V>(store: object): store is ReadableStore<V> {
    return false;
  };

  export function query<V>(store: ReadableStore<V>, query) {
    return null;
  };

};

export type MutableStore<V> = {
  add: (data: V) => V;
  remove: (data: V) => V;
};

export module MutableStore {
  export function isMutableStore<V>(store: object): store is MutableStore<V> {
    return false;
  };

  export function add<V>(store: MutableStore<V>, data) {
    return null;
  };

  export function remove<V>(store: MutableStore<V>, data) {
    return null;
  };
}

export type Store<V> = ReadableStore<V> | (ReadableStore<V> & MutableStore<V>);

export module Store {
  function _fromConfig(config: StoreConfig): object {
    return {};
  };

  export function create<V>(config: StoreConfig): Store<V> {
    let store = _fromConfig(config);

    const storeFns = Object.keys(Store).reduce((memo, key) => {
      const fn = Store[key];
      return {
        ...memo,
        [key]: (...args) => fn(store, ...args)
      }
    }, {});

    store = { ...store, ...storeFns };

    const readableStoreFns = Object.keys(ReadableStore).reduce((memo, key) => {
      const fn = Store[key];
      return {
        ...memo,
        [key]: (...args) => fn(store, ...args)
      }
    }, {});

    store = { ...store, ...readableStoreFns };


    if ('mutable' in config && config.mutable) {
      const mutableStoreFns = Object.keys(MutableStore).reduce((memo, key) => {
        const fn = Store[key];
        return {
          ...memo,
          [key]: (...args) => fn(store, ...args)
        }
      }, {});

      store = { ...store, ...mutableStoreFns };

      return <ReadableStore<V> & MutableStore<V>>store;
    }

    return <ReadableStore<V>>store;
  };

  export function isStore<V>(obj: object): obj is Store<V> {
    // Every store should be readable, but nevermind the fallback
    return ReadableStore.isReadableStore(obj) || MutableStore.isMutableStore(obj);
  };
};

export default Store;
