"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = require("./observable");
function create() {
    const observable = observable_1.Subject.create();
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
