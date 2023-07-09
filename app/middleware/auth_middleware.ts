import * as Users from '../model/Users'
import * as jwt from 'jsonwebtoken';
import * as Message from '../utils/messages';
import { UserRole, isRole } from '../model/Users';

require('dotenv').config();

const TOKEN_COST: number = 0;

export function checkAuthHeader (req: any, res: any, next: any): void{
    if (req.headers.authorization) next();
    else next(Error(Message.no_auth_header_message));
}

export function checkToken(req: any, res: any, next: any): void{
    const bearerHeader: string = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else next(Error(Message.missing_token_message));
}

export function verifyAndAuthenticate(req: any, res: any, next: any): void{
    try {
        const decoded: string | jwt.JwtPayload  = jwt.verify(req.token, process.env.KEY);
        if (decoded != null) {
            req.body = decoded;
            next();
        }
    } catch (error) { 
        next(Error(Message.invalid_token_message)); 
    }
}

// usare dopo la chain del jwt, per operazioni admin
export function isAdmin(req: any, res: any, next: any): void{
    if (isRole(UserRole.Admin, req.body.user.email)) {
        next();
      } else {
        next(Error(Message.unauthorized_message));
      }
}

export function checkTokenAmount(req: any, res: any, next: any): void{
    Users.getTokenNumber(req.body.user.email).then((user:any)=>{
        if(user.token>TOKEN_COST){
            next();
        }else{
            next(Error(Message.unauthorized_message));
        }
    });
}