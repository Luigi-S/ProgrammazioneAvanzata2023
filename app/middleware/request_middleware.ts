import { ErrorWithStatus, getErrorWithStatus } from '../utils/errors';
import * as Message from '../utils/messages'

const DATE_FORMATS = ['DD-MM-YYYY', 'DD/MM/YYYY'];

export function notFound(req: any, res: any, next: any) {
    next(Error(Message.not_found_msg));
}

export function checkPayloadHeader(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else next(Error(Message.no_payload_msg));
}

export function checkJSONPayload(req: any, res: any, next: any): void{
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        next(Error(Message.malformed_payload_message))
    }
}

export function checkValidPeriod(req: any, res: any, next: any): void{ 
    const moment = require('moment');
    const start: string = req.start;
    const end: string = req.end;
    if((moment(start, DATE_FORMATS, true).isValid() || !start) &&
        (moment(end, DATE_FORMATS, true).isValid() || !end)){
        if(start && end && Date.parse(end)<=Date.parse(start)){
            next(Error(Message.bad_request_msg));    
        }
        next();
    }else{
        next(Error(Message.bad_request_msg));
    }
}

export function logErrors(err: any, req: any, res: any, next: any): void {
    let new_err: ErrorWithStatus = getErrorWithStatus(err);
    console.log(new_err.toString());
    next(new_err);
}

export function errorHandler(error: ErrorWithStatus, req: any, res: any, next: any): void { 
    res.status(error.status).json(error.err.message);
}