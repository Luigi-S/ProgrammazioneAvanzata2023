import * as UserController from '../controller/user_controller'
import * as jwt from 'jsonwebtoken';
import * as Message from '../utils/messages';
import { UserRole, TOKEN_COST } from '../model/Users';
import { public_key } from '../server';


require('dotenv').config();

// verifica che l'header della request sia presente
export function checkAuthHeader (req: any, res: any, next: any): void{
    if (req.headers.authorization) next();
    else next(Message.no_auth_header_message);
}

// verifica che nell'header sia presente un token JWT
export function checkToken(req: any, res: any, next: any): void{
    const bearerHeader: string = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else next(Message.missing_token_message);
}

// verifica la validità del token e ne estrae i dati della richiesta, asseganti al req.body 
export function verifyAndAuthenticate(req: any, res: any, next: any): void{
    try {
        const decoded: string | jwt.JwtPayload  = jwt.verify(req.token, public_key, { algorithm:'RS256'});
        if (decoded != null) {
            req.body = decoded;
            next();
        }
    } catch (error) { 
        next(Message.invalid_token_message); 
    }
}

// usare dopo la chain del jwt, per operazioni admin
export function isAdmin(req: any, res: any, next: any): void{
    if (UserRole.Admin === req.body.user.role) {
        next();
    } else {
        next(Message.unauthorized_message);
    }
}

// verifica che l'email associata al token jwt corrisponda ad un user esistente
export function checkOwnerExists(req: any, res: any, next: any): void{
    UserController.getUser(req.body.user).then((value)=>{
        if(value){
            req.body.user = value,
            next();
        }else {
            next(Message.bad_request_msg);
        }
    }).catch((err)=>{
        console.log(err);
        next(Message.bad_request_msg);
    });
}

// varifica che  l'email associata al token jwt corrisponda ad un user con almeno un token
export function checkTokenAmount(req: any, res: any, next: any): void{
    if(req.body.user.token>= TOKEN_COST){
        next();
    }else{
        next(Message.unauthorized_message);
    }
}