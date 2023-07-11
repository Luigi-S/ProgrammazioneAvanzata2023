import * as Users from '../model/Users'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

export function updateToken(req:any, res:any, next:any){
    Users.updateToken(req.body.tokens, req.body.user_email).then(()=>{
        // TODO admin deve pagare un token?
        res.status(HttpStatus.CREATED).json({
            message: Message.token_updated_message,
            tokens: req.body.tokens,
            user_email: req.body.user_email
        });
        next();
    });
}