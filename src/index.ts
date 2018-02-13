import Config from './config';

import Ontology from './ontology';

import Bus from './bus';
import Store from './store';

export type ontopic<V> = {
  bus: Bus<V>
  store: Store<V>
  // config: Config;
  // store: () => void;
  // bus: () => void;
  // graphql: () => void;
  // start: () => void;
};

export function ontopic<V>(config: Config<V> = <Config<V>><any>Config.Default): ontopic<V> {
  // Initialise the system here with an ontology

  // Return something that can be configured declaritvely like express.
  // 'I want to use these stores and listen to updates from these busses!'
  // 'Also give me a GraphQL and a SparQL server to query my stores.'
  // 'Also make GraphQL subscriptions using the busses'
  return ontopic.create(config);
}

export module ontopic {
  export function create<V>(config: Config<V>): ontopic<V> {
    return null;
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
