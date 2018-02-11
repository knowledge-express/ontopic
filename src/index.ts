import Config from './config';

export default function ontopic(config: Config) {
  // Initialise the system here with an ontology

  // Return something that can be configured declaritvely like express.
  // 'I want to use these stores and listen to updates from these busses!'
  // 'Also give me a GraphQL and a SparQL server to query my stores.'
  // 'Also make GraphQL subscriptions using the busses'
  return null;
}

export * from './config';
export * from './ontology';
export * from './bus';
export * from './store';
