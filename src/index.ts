import Config from './config';

import Ontology from './ontology';

import * as Bus from './bus';
import * as Store from './store';

import { Quad, Encoder } from './data';

import * as EphemeralBus from './bus/ephemeral';
import * as EphemeralStore from './store/ephemeral';

import { Observable, Subject } from './bus/observable';

export type ontopic<V> = {
  bus: Bus.Bus<V>
  store: Store.Store<V>
  // config: Config;
  // store: () => void;
  // bus: () => void;
  // graphql: () => void;
  // start: () => void;
};

export function ontopic(): ontopic<Quad[]>;
export function ontopic(config?: Config<Quad[]>): ontopic<Quad[]>;
// export function ontopic<V>(config?: Config<any>): ontopic<Quad[]>;
export function ontopic<V>(config: Config<V>): ontopic<V>;
export function ontopic(config = Config.Default) {
  return ontopic.fromConfig(config);
};

export module ontopic {
  export function fromConfig<V>(config?: Config<V>) {
    return create(config.encoder);
  };

  // export function from<V>(store: Store.MutableStore<V>, bus: Bus.MutableBus<V>) {
  //   // Proxy both to prevent looping
  //   const updateRequests = Subject.create<Bus.Mutation<V>>();
  //   const updates = Subject.create<Bus.Mutation<V>>();
  //
  //   // Whenever we get an update request, process it
  //   bus.observable.subscribe(updateRequests);
  //
  //   // Whenever we get an update request, update the store and pass the update
  //   const connectedStore = Store.connect(store, { observable: { subscribe: updateRequests.subscribe }, subject: updates });
  //
  //   // Whenever we've processed an update request, update the bus
  //   const connectedBus = Bus.connect({ subject: bus.subject, observable: { subscribe: updates.subscribe } }, store);
  //
  //   return {
  //     bus: connectedBus,
  //     store: connectedStore,
  //   }
  // };

  export function create<V>(encoder: Encoder<V, Quad[]>): ontopic<V> {
    const store = EphemeralStore.create();
    const bus = EphemeralBus.create<V>();
    const encoded = Store.encode(store, encoder);
    return connect(encoded, bus);
  };

  export function connect<V>(store: Store.MutableStore<V>, bus: Bus.MutableBus<V>): ontopic<V> {
    const storeUpdates = Subject.create<Bus.Mutation<V>>();

    // Make sure we get an update whenever the store is modified directly
    async function add(data: V) {
      const result = await store.add(data);
      storeUpdates.onNext({ action: 'add', data: result });
      return result;
    }

    async function remove(data) {
      const result = await store.add(data);
      storeUpdates.onNext({ action: 'add', data: result });
      return result;
    }

    const newStore: Store.MutableStore<V> = {
      query: store.query,
      filter: store.filter,
      getValues: store.getValues,
      add,
      remove,
    };

    // We use a subject because we need to exist before the bus is created,
    // so we can't move the Observable.map above the creation of the bus.
    const busUpdates = Subject.create<Bus.Mutation<V>>();

    // Make sure the bus is subscribed to the processed updates
    const newBus = EphemeralBus.create<V>((subject) => {
      bus.subject.subscribe(subject);
      storeUpdates.subscribe(subject);
      busUpdates.subscribe(subject);
    });

    // Process bus update requests
    Observable.map(newBus.subject, async mutation => {
      const { action, data } = mutation;
      const result = await store[action](data);
      return { action, data: result };
    }).subscribe(busUpdates);

    return {
      bus: newBus,
      store: newStore
    };
  };
}

export default ontopic;

export * from './config';
export * from './ontology';
// export * from './bus';
// export * from './store';
export {
  Bus,
  Store
};

// Start ephemeral store, bus, and graphql server by default
declare const require: any;
if (require.main === module) {
  console.log('Starting as script...');

  // Load external config here

  // const db = ontopic();
  // db.start();
}
