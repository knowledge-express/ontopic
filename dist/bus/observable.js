"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var Disposable;
(function (Disposable) {
    function create(disposer) {
        var done = false;
        return {
            dispose() {
                if (done)
                    return;
                done = true;
                if (disposer)
                    disposer();
            }
        };
    }
    Disposable.create = create;
})(Disposable = exports.Disposable || (exports.Disposable = {}));
var Observable;
(function (Observable) {
    function create(fn) {
        var subject;
        function subscribe(observer) {
            if (!subject) {
                subject = Subject.create();
                if (fn)
                    fn(subject);
            }
            return subject.subscribe(observer);
        }
        return { subscribe };
    }
    Observable.create = create;
    function pipe(observable, observer) {
        observable.subscribe(observer);
        return observer;
    }
    Observable.pipe = pipe;
    function map(observable, mapFn) {
        return create(subject => {
            observable.subscribe({
                onNext: value => Promise.resolve(mapFn(value)).then(subject.onNext)
            });
        });
    }
    Observable.map = map;
    function filter(observable, filterFn) {
        return create(subject => {
            observable.subscribe({
                onNext: value => Promise.resolve(filterFn(value)).then(result => result ? subject.onNext(value) : undefined)
            });
        });
    }
    Observable.filter = filter;
    function flatten(observable) {
        return create(subject => {
            observable.subscribe({
                onNext: (values) => __awaiter(this, void 0, void 0, function* () {
                    return values.reduce((memo, value) => __awaiter(this, void 0, void 0, function* () {
                        yield memo;
                        return subject.onNext(value);
                    }), Promise.resolve());
                })
            });
        });
    }
    Observable.flatten = flatten;
    ;
    function zip(observable, other) {
        return create(subject => {
            let nextPromise;
            let completePromise;
            observable.subscribe({
                onNext: (value) => __awaiter(this, void 0, void 0, function* () {
                    if (!nextPromise) {
                        nextPromise = Promise.resolve(value);
                        return;
                    }
                    const otherValue = yield nextPromise;
                    yield subject.onNext([value, otherValue]);
                    return;
                }),
                onError: subject.onError,
                onComplete: (result) => __awaiter(this, void 0, void 0, function* () {
                    if (!completePromise) {
                        completePromise = Promise.resolve(result);
                        return;
                    }
                    const otherResult = yield completePromise;
                    yield subject.onComplete([result, otherResult]);
                    return;
                })
            });
            other.subscribe({
                onNext: (value) => __awaiter(this, void 0, void 0, function* () {
                    if (!nextPromise) {
                        nextPromise = Promise.resolve(value);
                        return;
                    }
                    const otherValue = yield nextPromise;
                    yield subject.onNext([otherValue, value]);
                    return;
                }),
                onError: subject.onError,
                onComplete: (result) => __awaiter(this, void 0, void 0, function* () {
                    if (!completePromise) {
                        completePromise = Promise.resolve(result);
                        return;
                    }
                    const otherResult = yield completePromise;
                    yield subject.onComplete([otherResult, result]);
                    return;
                })
            });
        });
    }
    Observable.zip = zip;
    function scan(observable, scanFn, memo) {
        return create(subject => {
            observable.subscribe({
                onNext: value => Promise.resolve(scanFn(memo, value)).then(value => { memo = value; return subject.onNext(value); })
            });
        });
    }
    Observable.scan = scan;
    function forEach(observable, fn) {
        return observable.subscribe({
            onNext: fn
        });
    }
    Observable.forEach = forEach;
    function fromPromise(promise) {
        return create(subject => {
            promise.then(subject.onNext).then(subject.onComplete);
        });
    }
    Observable.fromPromise = fromPromise;
    function toPromise(observable) {
        return new Promise((resolve, reject) => {
            observable.subscribe({
                onNext: resolve,
                onComplete: resolve,
                onError: reject
            });
        });
    }
    Observable.toPromise = toPromise;
})(Observable = exports.Observable || (exports.Observable = {}));
var Subject;
(function (Subject) {
    function isSubject(obj) {
        return typeof obj["onNext"] === "function";
    }
    Subject.isSubject = isSubject;
    function create() {
        var observers = Object.create(null), current = Promise.resolve(), completed = false, result, errored = false, error;
        function subscribe(observer) {
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
        function onNext(value) {
            return __awaiter(this, void 0, void 0, function* () {
                return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onNext(value))).then(() => { }));
            });
        }
        function onComplete(res) {
            return __awaiter(this, void 0, void 0, function* () {
                completed = true;
                result = res;
                return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onComplete ? observers[key].onComplete(res) : undefined)).then(() => { observers = null; }));
            });
        }
        function onError(reason) {
            return __awaiter(this, void 0, void 0, function* () {
                errored = true;
                error = reason;
                return current = current.then(() => Promise.all(Object.keys(observers).map(key => observers[key].onError ? observers[key].onError(reason) : undefined)).then(() => { observers = null; }));
            });
        }
        return { subscribe, onNext, onComplete, onError };
    }
    Subject.create = create;
})(Subject = exports.Subject || (exports.Subject = {}));
