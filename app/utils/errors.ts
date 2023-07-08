import * as Message from './messages'

var HttpStatus = require('http-status-codes');

export class ErrorWithStatus {
    status: number;
    err: Error;
    constructor(status: number, err: Error){
        this.status = status;
        this.err = err;
    }
    toString () { return `{ status: ${this.status}, msg: ${this.err.message} }`;}
}

export function getErrorWithStatus(err: Error): ErrorWithStatus{
    let status: number;
    switch (err.message){
        case Message.not_found_msg:
            status = HttpStatus.NOT_FOUND;
            break;
        case  Message.bad_request_msg:
            status = HttpStatus.BAD_REQUEST;
            break;
        case Message.unauthorized_message:
            status = HttpStatus.UNAUTH;
            break;
        case Message.internal_server_error_message:
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            break;
        case Message.unexisting_food_message:
            status = HttpStatus.BAD_REQUEST;
            break;
        default:
            status = HttpStatus.BAD_REQUEST;
    }
    return new ErrorWithStatus(status, err);
}