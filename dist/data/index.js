"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const isuri = require("isuri");
function iriify(str) {
    return `<${str}>`;
}
exports.iriify = iriify;
function encodeRDF(str) {
    if (isURI(str))
        return iriify(str);
    if (isLiteral(str))
        return encodeLiteral(str);
    try {
        JSON.parse(str);
        return str;
    }
    catch (e) {
        return JSON.stringify(str);
    }
}
exports.encodeRDF = encodeRDF;
function isURI(str) {
    return isuri.isValid(str);
}
exports.isURI = isURI;
function isLiteral(str) {
    return /\^\^/.test(str);
}
exports.isLiteral = isLiteral;
function encodeLiteral(str) {
    const [value, type] = str.split("^^");
    return `${value}^^${iriify(type)}`;
}
exports.encodeLiteral = encodeLiteral;
__export(require("./quad"));
