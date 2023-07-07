"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handling = exports.any_other = void 0;
var RequestMiddleware = require("./request_middleware");
/// file contente le catene di middleware da impiegare
exports.any_other = [
    RequestMiddleware.notFound
];
exports.error_handling = [
    RequestMiddleware.logErrors,
    RequestMiddleware.errorHandler
];
