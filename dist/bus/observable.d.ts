export interface Disposable {
    dispose(): void;
}
export interface Observer<T> {
    onNext: (value: T) => void | Promise<void>;
    onComplete?: (result?: any) => void | Promise<void>;
    onError?: (reason?: any) => void | Promise<void>;
}
export interface Observable<T> {
    subscribe(observer: Observer<T>): Disposable;
}
export interface Subject<T> extends Observable<T>, Observer<T> {
}
export declare module Disposable {
    function create(disposer?: () => void): Disposable;
}
export declare module Observable {
    function create<T>(fn?: (subject: Subject<T>) => void): {
        subscribe: (observer: Observer<T>) => Disposable;
    };
    function pipe<T, U>(observable: Observable<T>, observer: Subject<T>): Subject<T>;
    function pipe<T>(observable: Observable<T>, observer: Observer<T>): Observer<T>;
    function map<T, U>(observable: Observable<T>, mapFn: (value: T) => U | Promise<U>): Observable<U>;
    function filter<T>(observable: Observable<T>, filterFn: (value: T) => boolean | Promise<boolean>): Observable<T>;
    function scan<T, U>(observable: Observable<T>, scanFn: (memo: U, value: T) => U | Promise<U>, memo: U): Observable<U>;
    function forEach<T>(observable: Observable<T>, fn: (value: T) => void | Promise<void>): Disposable;
    function fromPromise<T>(promise: Promise<T>): {
        subscribe: (observer: Observer<{}>) => Disposable;
    };
    function toPromise<T>(observable: Observable<T>): Promise<T>;
}
export declare module Subject {
    function isSubject<T>(obj: any): obj is Subject<T>;
    function create<T>(): Subject<T>;
}
