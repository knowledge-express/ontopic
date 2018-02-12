import Bus from './bus';
import Store from './store';
import { Quad } from './data';

export type Config<V> = {
  busses: Bus<V>[]
  stores: Store<V>[]
};

export module Config {
  export const Default: Config<Quad[]> = {
    busses: [],
    stores: [],
  };

  export function bus<V>(config: Config<V>, bus: Bus<V>): Config<V> {
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
