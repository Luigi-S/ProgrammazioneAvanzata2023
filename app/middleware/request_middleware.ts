import { ErrorWithStatus, getErrorWithStatus } from '../utils/errors';
import * as Message from '../utils/messages'


export function notFound(req: any, res: any, next: any) {
    console.log(Message.not_found_msg);
    next(Error(Message.not_found_msg));
}


export function logErrors(err: any, req: any, res: any, next: any): void {
    let new_err: ErrorWithStatus = getErrorWithStatus(err);
    console.log(new_err.toString());
    next(new_err);
}

export function errorHandler(error: ErrorWithStatus, req: any, res: any, next: any): void { 
    res.status(error.status).send(error.err.message);
}