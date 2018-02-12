import Config from './config';

import Ontology from './ontology';

import Bus from './bus';
import Store from './store';

export type ontopic = {
  config: Config;
  store: () => void;
  bus: () => void;
  graphql: () => void;
  start: () => void;
};

export function ontopic(config: Config = Config.Default) {
  // Initialise the system here with an ontology

  // Return something that can be configured declaritvely like express.
  // 'I want to use these stores and listen to updates from these busses!'
  // 'Also give me a GraphQL and a SparQL server to query my stores.'
  // 'Also make GraphQL subscriptions using the busses'
  return ontopic.create(config);
}

export module ontopic {
  export function create(config: Config): ontopic {
    let ontop = {
      config
    };

    const functions = Object.keys(ontopic).reduce((memo, key) => {
      const fn = ontopic[key];
      return {
        ...memo,
        [key]: (...args) => fn(ontop, ...args)
      }
    }, {});

    ontop = { ...ontop, ...functions };

    return <ontopic>ontop;
  };

  export function bus(ontop: ontopic, bus: Bus): ontopic {
    // Modify config
    return ontop;
  };

  export function store(ontop: ontopic, store: Store): ontopic {
    // Modify config
    return ontop;
  };

  export function graphql(ontop: ontopic): ontopic {
    // Modify config
    return ontop;
  };

  export function start(ontop: ontopic): void {
    // This is the function that should actually do stuff
    console.log('Staring ontopic with config:', ontop.config);

    return;
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

  const db = ontopic();
  db.start();
}
