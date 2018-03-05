import { Bus } from '../bus';
import { Store } from '../store';

export type Interfaceable<V> = Bus<V> | Store<V>;
export type Interface<V, I> = Object | Function;

export type Interfacer<V, I> = {
  (interfaceable: Interfaceable<V>): Interface<V, I>
};

export type BusInterface<V, I> = Interface<Bus<V>, I>;
export type StoreInterface<V, I> = Interface<Store<V>, I>;

export * from './graphql';
