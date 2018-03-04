// Drenched up from Sonic

export interface Disposable {
  dispose(): void;
}

export interface Observer<T> {
  onNext: (value: T) => void | Promise<void>
  onComplete?: (result?: any) => void | Promise<void>
  onError?: (reason?: any) => void | Promise<void>
}

export interface Observable<T> {
  subscribe(observer: Observer<T>): Disposable;
}

export interface Subject<T> extends Observable<T>, Observer<T> {}

export module Disposable {
  export function create(disposer?: () => void): Disposable {
    var done = false;

    return {
      dispose() {
        if (done) return;
        done = true;
        if (disposer) disposer();
      }
    };
  }
}

export module Observable {
  export function create<T>(fn?: (subject: Subject<T>) => void) {
    var subject: Subject<T>;

    function subscribe(observer: Observer<T>): Disposable {
      if (!subject) {
        subject = Subject.create();
        if (fn) fn(subject);
      }

      return subject.subscribe(observer);
    }

    return { subscribe };
  }

  export function pipe<T, U>(observable: Observable<T>, observer: Subject<T>): Subject<T>;
  export function pipe<T>(observable: Observable<T>, observer: Observer<T>): Observer<T>;
  export function pipe<T>(observable: Observable<T>, observer: Observer<T>): any {
    observable.subscribe(observer);
    return observer;
  }

  export function map<T, U>(observable: Observable<T>, mapFn: (value: T) => U | Promise<U>): Observable<U> {
    return create<U>(subject => {
      observable.subscribe({
        onNext: value => Promise.resolve(mapFn(value)).then(subject.onNext)
      });
    });
  }

  export function filter<T>(observable: Observable<T>, filterFn: (value: T) => boolean | Promise<boolean>): Observable<T>  {
    return create<T>(subject => {
      observable.subscribe({
        onNext: value => Promise.resolve(filterFn(value)).then(result => result ? subject.onNext(value) : undefined)
      });
    });
  }

  export function flatten<T>(observable: Observable<T[]>): Observable<T> {
    return create<T>(subject => {
      observable.subscribe({
        onNext: async values => values.reduce(async (memo, value) => {
          await memo;
          return subject.onNext(value);
        }, Promise.resolve())
      })
    });
  };

export function zip<V, W>(observable: Observable<V>, other: Observable<W>): Observable<[V, W]> {
  return create<[V, W]>(subject => {
    let nextPromise;
    let completePromise;
    observable.subscribe({
      onNext: async value => {
        if (!nextPromise) {
          nextPromise = Promise.resolve(value);
          return;
        }
        const otherValue = await nextPromise;
        await subject.onNext([ value, otherValue ]);
        return;
      },
      onError: subject.onError,
      onComplete: async result => {
        if (!completePromise) {
          completePromise = Promise.resolve(result);
          return;
        }
        const otherResult = await completePromise;
        await subject.onComplete([ result, otherResult ]);
        return;
      }
    });

    other.subscribe({
      onNext: async value => {
        if (!nextPromise) {
          nextPromise = Promise.resolve(value);
          return;
        }
        const otherValue = await nextPromise;
        await subject.onNext([ otherValue, value ]);
        return;
      },
      onError: subject.onError,
      onComplete: async result => {
        if (!completePromise) {
          completePromise = Promise.resolve(result);
          return;
        }
        const otherResult = await completePromise;
        await subject.onComplete([ otherResult, result ]);
        return;
      }
    });
  });
}

  export function scan<T, U>(observable: Observable<T>, scanFn: (memo: U, value: T) => U | Promise<U>, memo: U): Observable<U> {
    return create<U>(subject => {
      observable.subscribe({
        onNext: value => Promise.resolve(scanFn(memo, value)).then(value => { memo = value; return subject.onNext(value) })
      });
    });
  }

  export function forEach<T>(observable: Observable<T>, fn: (value: T) => void | Promise<void>): Disposable {
    return observable.subscribe({
      onNext: fn
    });
  }
  export function fromPromise<T>(promise: Promise<T>) {
    return create<T>(subject => {
      promise.then(subject.onNext).then(subject.onComplete);
    });
  }

  export function toPromise<T>(observable: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      observable.subscribe({
        onNext: resolve,
        onComplete: resolve,
        onError: reject
      });
    });
  }
}

export module Subject {
  export function isSubject<T>(obj: any): obj is Subject<T> {
    return typeof obj["onNext"] === "function";
  }

  export function create<T>(): Subject<T> {
    var observers: {[key: string]: Observer<T>} = Object.create(null),
        current = Promise.resolve(),
        completed = false,
        result: any,
        errored = false,
        error: any;

    function subscribe(observer: Observer<T>): Disposable {
      if (completed) {
        Promise.resolve(() => observer.onComplete(result));
        return Disposable.create();
      }

      if (errored) {
        Promise.resolve(() => observer.onError(error));
        return Disposable.create();
      }

      var observerKey = `observer-${Math.random()}`;
      observers[observerKey] = observer;
      return Disposable.create(() => delete observers[observerKey]);
    }

    async function onNext(value: T): Promise<void> {
      return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onNext(value))).then(() => {}));
    }

    async function onComplete(res?: any): Promise<void> {
      completed = true;
      result = res;
      return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onComplete ? observers[key].onComplete(res) : undefined)).then(() => {observers = null;}));
    }

    async function onError(reason?: any): Promise<void> {
      errored = true;
      error = reason;
      return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onError ? observers[key].onError(reason) : undefined)).then(() => {observers = null;}));
    }

    return { subscribe, onNext, onComplete, onError };
  }
}
