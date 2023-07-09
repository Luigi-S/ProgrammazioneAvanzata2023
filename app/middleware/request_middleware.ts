import { ErrorWithStatus, getErrorWithStatus } from '../utils/errors';
import * as Message from '../utils/messages'


export function notFound(req: any, res: any, next: any) {
    next(Error(Message.not_found_msg));
}

export function checkPayloadHeader(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else next(Error(Message.no_payload_msg));
}

/*
eliminabile, in teoria non ho rotte POST senza auth
export function checkJSONPayload(req: any, res: any, next: any): void{
    try {
        req = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        next(Error(Message.malformed_payload_message))
    }
}
*/

export function logErrors(err: any, req: any, res: any, next: any): void {
    let new_err: ErrorWithStatus = getErrorWithStatus(err);
    console.log(new_err.toString());
    next(new_err);
}

export function errorHandler(error: ErrorWithStatus, req: any, res: any, next: any): void { 
    res.status(error.status).json(error.err.message);
}