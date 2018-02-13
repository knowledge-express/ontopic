import Config from './config';

import Ontology from './ontology';

import Bus from './bus';
import Store from './store';

import { Quad } from './data';

import * as EphemeralBus from './bus/ephemeral';
import * as EphemeralStore from './store/ephemeral';

import { Observable, Subject } from './bus/observable';

export type ontopic<V> = {
  bus: Bus<V>
  store: Store<V>
  // config: Config;
  // store: () => void;
  // bus: () => void;
  // graphql: () => void;
  // start: () => void;
};

export function ontopic<V>(config: Config<V> = <Config<V>><any>Config.Default): ontopic<Quad[]> {
  // Initialise the system here with an ontology

  // Return something that can be configured declaritvely like express.
  // 'I want to use these stores and listen to updates from these busses!'
  // 'Also give me a GraphQL and a SparQL server to query my stores.'
  // 'Also make GraphQL subscriptions using the busses'
  return ontopic.create(config);
}

export module ontopic {
  export function create<V>(config: Config<V>): ontopic<Quad[]> {
    const store = EphemeralStore.create();

    // Mutating to the newStore ensures an update is sent on the storeUpdates
    const storeUpdates = Subject.create();
    const newStore = {
      ...store,
      add: async (data) => {
        const result = await store.add(data);
        storeUpdates.onNext({ action: 'add', data: result });
        return result;
      },
      remove: async (data) => {
        const result = await store.remove(data);
        storeUpdates.onNext({ action: 'remove', data: result });
        return result;
      },
    };

    // We use a subject because we need to exist before the bus is created,
    // so we can't move the Observable.map above the creation of the bus.
    const busUpdates = Subject.create();

    // Connect store to bus
    const bus = EphemeralBus.create((subject) => {
      storeUpdates.subscribe(subject);
      busUpdates.subscribe(subject);
    });

    // Connect bus to store
    Observable.map(bus.subject, async mutation => {
      const { action, data } = mutation;
      return { action, data: await store[action](data) };
    }).subscribe(busUpdates);

    return {
      bus,
      store: newStore
    };
  };
}

export default ontopic;

export * from './config';
export * from './ontology';
export * from './bus';
export * from './store';

// Start ephemeral store, bus, and graphql server by default
declare const require: any;
if (require.main === module) {
  console.log('Starting as script...');

  // Load external config here

  // const db = ontopic();
  // db.start();
}
