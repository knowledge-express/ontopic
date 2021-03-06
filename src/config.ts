import Ontology from './ontology';
import Bus from './bus';
import Store from './store';
import { Encoder, Quad, Mutation } from './data';

export type Config<V> = {
  encoder: Encoder<Quad[], V>
  busses: Bus<Mutation<V>>[]
  stores: Store<V>[]
};

export module Config {
  export const Default: Config<Quad[]> = {
    encoder: Encoder.Identity<Quad[]>(),
    busses: [],
    stores: [],
  };

  export function ontology<V>(config: Config<V>, ontology: Ontology): Config<V> {
    // Modify config
    return config;
  };


  export function bus<V>(config: Config<V>, bus: Bus<Mutation<V>>): Config<V> {
    // Modify config
    return config;
  };

  export function store<V>(config: Config<V>, store: Store<V>): Config<V> {
    // Modify config
    return config;
  };

  // export function graphql<V>(config: Config<V>, graphqlConfig): Config<V> {
  //   // Modify config
  //   return config;
  // };

};

export default Config;
