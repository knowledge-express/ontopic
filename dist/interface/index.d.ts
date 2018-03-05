import { Bus } from '../bus';
import { Store } from '../store';
export declare type Interfaceable<V> = Bus<V> | Store<V>;
export declare type Interface<V, I> = Object | Function;
export declare type Interfacer<V, I> = {
    (interfaceable: Interfaceable<V>): Interface<V, I>;
};
export declare type BusInterface<V, I> = Interface<Bus<V>, I>;
export declare type StoreInterface<V, I> = Interface<Store<V>, I>;
export * from './graphql';
