"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = require("./observable");
function create(updater) {
    const observable = observable_1.Observable.create(updater);
    const subject = observable_1.Subject.create();
    return {
        observable,
        subject
    };
}
exports.create = create;
;
exports.default = {
    create
};
