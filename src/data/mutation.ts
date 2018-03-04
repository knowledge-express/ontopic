import { MutableStore } from '../store';

export type Mutation<V> = {
  action: 'add' | 'remove'
  data: V
};

export module Mutation {
  export function isMutation<V>(obj: object): obj is Mutation<V> {
    return typeof obj === 'object' &&
      'action' in obj &&
      (obj['action'] === 'add' || obj['action'] === 'remove') &&
      'data' in obj;
  }

  export function add<V>(data: V): Mutation<V> {
    return { action: 'add', data };
  }

  export function remove<V>(data: V): Mutation<V> {
    return { action: 'remove', data };
  }

  export async function apply<V>(mutation: Mutation<V>, store: MutableStore<V>): Promise<Mutation<V>> {
    const { action, data } = mutation;
    const result = await store[action](data);
    return { action, data: result };
  }

  export async function map<V, W>(mutation: Mutation<V>, mapFn: (v: V) => W | Promise<W>): Promise<Mutation<W>> {
    const encoded = await mapFn(mutation.data);
    return { ...mutation, data: encoded };
  }
};

export default Mutation;
