import * as Users from '../model/Users'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

/**
 * @param req
 * @param res 
 * @param next 
 * 
 * metodo per aggiornare al nuovo valore: "tokens", il credito di un utente, identificato da "user_email"
 * La response, in caso positivo restituisce un messaggio di successo, l'utente aggiornato e il nuovo credito
 */
export function updateToken(req:any, res:any, next:any){
    Users.updateToken(req.body.tokens, req.body.user_email).then(()=>{
        res.status(HttpStatus.CREATED).json({
            message: Message.token_updated_message,
            tokens: req.body.tokens,
            user_email: req.body.user_email
        });
        next();
    });
}