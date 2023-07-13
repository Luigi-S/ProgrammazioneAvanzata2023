import * as Users from '../model/Users'
import * as Message from '../utils/messages'

export function checkAmountPositive(req: any, res: any, next: any): void{
    if(req.body.tokens>0){
        next();
    }else{
        next(Message.bad_request_msg);
    }
}

export function checkUserExists(req: any, res: any, next: any): void{
    Users.getUser(req.body.user_email).then((value)=>{
        if(value){
            next();
        }else{
            next(Message.bad_request_msg);
        }
    });
}