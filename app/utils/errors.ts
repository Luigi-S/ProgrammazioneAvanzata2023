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
        case Message.bad_request_msg:
            status = HttpStatus.BAD_REQUEST;
            break;
        case Message.no_payload_msg:
            status = HttpStatus.BAD_REQUEST; // NON SO SE é GIUSTO    
            break;
        case Message.unauthorized_message:
            status = HttpStatus.UNAUTHORIZED;
            break;

        case Message.missing_token_message:
            status = HttpStatus.UNAUTHORIZED;
            break;
        case Message.invalid_token_message:
            status = HttpStatus.UNAUTHORIZED;
            break;
        case Message.no_auth_header_message:
            status = HttpStatus.UNAUTHORIZED;
            break;
        case Message.unauthorized_message:
            status = HttpStatus.UNAUTHORIZED;
            break;

        case Message.internal_server_error_message:
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            break;
        case Message.not_executing_order_message:
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            break;
        case Message.unexisting_food_message:
            status = HttpStatus.BAD_REQUEST;
            break;
        case Message.exceeded_quantity_message:
            status = HttpStatus.BAD_REQUEST;
            break;
        case Message.already_taken_order_message:
            status = HttpStatus.BAD_REQUEST;
            break;

        case Message.not_next_message:
            status = HttpStatus.BAD_REQUEST; // TODO look per qualcosa di più specifico
            break;
        case Message.unacceptable_q_message:
            status = HttpStatus.BAD_REQUEST; // TODO look per qualcosa di più specifico
            break;
        case Message.repeated_food_message:
            status = HttpStatus.BAD_REQUEST;
            break;
        default:
            status = HttpStatus.BAD_REQUEST;
    }

    // TODO DEBUG
    console.log(`status : ${status}\nmessage: ${err.message}`)
    if(!status) status = HttpStatus.INTERNAL_SERVER_ERROR;
    return new ErrorWithStatus(status, err);
}