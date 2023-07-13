import { ErrorWithStatus, getErrorWithStatus } from '../utils/errors';
import * as Message from '../utils/messages'


// middleware per rotte assenti o non implementate -> restituisce NOT FOUND
export function notFound(req: any, res: any, next: any) {
    console.log(Message.not_found_msg);
    next(Message.not_found_msg);
}

// Ricava l'httpstatus da inviare, console log dell'errore
export function logErrors(err: any, req: any, res: any, next: any): void {
    let new_err: ErrorWithStatus = getErrorWithStatus(err);
    console.log(new_err.toString());
    next(new_err);
}

// invia messaggio di errore, con corrispondente httpstatus al client
export function errorHandler(error: ErrorWithStatus, req: any, res: any, next: any): void { 
    res.status(error.status).send(error.err.message);
}