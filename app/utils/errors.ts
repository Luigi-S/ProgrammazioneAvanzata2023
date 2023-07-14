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

class ErrorNotFound extends ErrorWithStatus{
    constructor(msg: string){
        super(HttpStatus.NOT_FOUND, Error(msg));
    }
}

class ErrorInternal extends ErrorWithStatus{
    constructor(msg: string){
        super(HttpStatus.INTERNAL_SERVER_ERROR, Error(msg));
    }
}

class ErrorBadRequest extends ErrorWithStatus{
    constructor(msg: string){
        super(HttpStatus.BAD_REQUEST, Error(msg));
    }
}

class ErrorUnauthorized extends ErrorWithStatus{
    constructor(msg: string){
        super(HttpStatus.UNAUTHORIZED, Error(msg));
    }
}

// semplice funzione factory, raccolti i dati dell'errore, possibilmente come Message.ErrData o Error, restituisce un'istanza di ErrorWithStatus
export function getErrorWithStatus(err): ErrorWithStatus{
    let retval : ErrorWithStatus;
    if(err && (err instanceof Message.ErrData) ){
        switch(err.status){
            case HttpStatus.NOT_FOUND:
                retval = new ErrorNotFound(err.msg);
                break;
            case HttpStatus.UNAUTHORIZED:
                retval = new ErrorUnauthorized(err.msg);
                break;
            case HttpStatus.BAD_REQUEST:
                retval = new ErrorBadRequest(err.msg);
                break;
            default:
                retval = new ErrorInternal(err.msg);
                break;
        }
    }else{
        retval = new ErrorInternal(err.msg);
    }
    return retval;
}