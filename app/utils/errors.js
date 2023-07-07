"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorWithStatus = exports.ErrorWithStatus = void 0;
var Message = require("./messages");
var HttpStatus = require('http-status-codes');
var ErrorWithStatus = /** @class */ (function () {
    function ErrorWithStatus(status, err) {
        this.status = status;
        this.err = err;
    }
    ErrorWithStatus.prototype.toString = function () { return "{ status: ".concat(this.status, ", msg: ").concat(this.err.message, " }"); };
    return ErrorWithStatus;
}());
exports.ErrorWithStatus = ErrorWithStatus;
function getErrorWithStatus(err) {
    var status;
    switch (err.message) {
        case Message.not_found_msg:
            status = HttpStatus.NOT_FOUND;
            break;
        case Message.bad_request_msg:
            status = HttpStatus.BAD_REQUEST;
            break;
        default:
            status = HttpStatus.BAD_REQUEST;
    }
    return new ErrorWithStatus(status, err);
}
exports.getErrorWithStatus = getErrorWithStatus;
