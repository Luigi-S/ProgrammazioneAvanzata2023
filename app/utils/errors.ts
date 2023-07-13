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

export class ErrData{
    msg:string;
    status:number;
    constructor(msg:string, status:number){
        this.msg = msg;
        this.status = status;
    }
}

export function getErrorWithStatus(err): ErrorWithStatus{
    if(err && (err instanceof ErrData) ) return new ErrorWithStatus(err.status, Error(err.msg));
    else return new ErrorWithStatus(HttpStatus.INTERNAL_SERVER_ERROR, Error(Message.internal_server_error_message.msg));
}