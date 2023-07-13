import * as Message from './messages'

var HttpStatus = require('http-status-codes');

// insieme di strumenti utilizzati per error handling e propagation


// classe che funge da involucro dell'errore, a cui aggiunge lo stato HTTP da trasmettere al client ed un semplice metodo toString
export class ErrorWithStatus {
    status: number;
    err: Error;
    constructor(status: number, err: Error){
        this.status = status;
        this.err = err;
    }
    toString () { return `{ status: ${this.status}, msg: ${this.err.message} }`;}
}

// semplice funzione factory, raccolti i dati dell'errore, possibilmente come Message.ErrData o Error, restituisce un'istanza di ErrorWithStatus
export function getErrorWithStatus(err): ErrorWithStatus{
    if(err && (err instanceof Message.ErrData) ) return new ErrorWithStatus(err.status, Error(err.msg));
    else return new ErrorWithStatus(HttpStatus.INTERNAL_SERVER_ERROR, Error(Message.internal_server_error_message.msg));
}