"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.logErrors = exports.notFound = void 0;
var errors_1 = require("../utils/errors");
var Message = require("../utils/messages");
function notFound(req, res, next) {
    next(Error(Message.not_found_msg));
}
exports.notFound = notFound;
function logErrors(err, req, res, next) {
    var new_err = (0, errors_1.getErrorWithStatus)(err);
    console.log(new_err);
    next(new_err);
}
exports.logErrors = logErrors;
function errorHandler(error, req, res, next) {
    res.status(error.status).json(error.err.message);
}
exports.errorHandler = errorHandler;
