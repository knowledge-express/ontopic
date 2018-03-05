import { Store, ReadableStore } from '.';

export type CompositeStore = ReadableStore;

export module CompositeStore {
  export function create<V>(stores: Store<V>[]): CompositeStore {
    return {
      getPropertyValue: (id, property) => getPropertyValue(stores, id, property),
      findBy: (types, predicate, value) => findBy(stores, types, predicate, value),
    };
  }

  export async function getPropertyValue(stores: ReadableStore[], id, property): Promise<string | object | string[] | object[]> {
    console.log('getPropertyValue:', id, property);

    const res: string | object | string[] | object[] = (await Promise.all(stores.map(store => store.getPropertyValue(id, property)))).reduce((memo, result) => {
      if (memo == null && result == null) return null;
      if (memo == null && result != null) return result;
      if (memo != null && result == null) return memo;
      if (memo != null && result != null) return [].concat(memo, result);
    }, undefined);

    console.log('getPropertyValue result:', res);
    return res;
  }

  export async function findBy(stores, types, predicate, value): Promise<string | object | string[] | object[]> {
    console.log('findBy:', types, predicate, value);

    const res: string | object | string[] | object[] = (await Promise.all(stores.map(store => store.findBy(types, predicate, value)))).reduce((memo, result) => {
      if (memo == null && result == null) return null;
      if (memo == null && !(result == null)) return result;
      if (memo != null && result == null) return memo;
      if (memo != null && result != null) return [].concat(memo, result);
    }, undefined);

    console.log('findBy result:', res);
    return res;
  }
}

export default CompositeStore;
