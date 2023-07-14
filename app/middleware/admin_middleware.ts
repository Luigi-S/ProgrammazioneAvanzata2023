import * as UserController from '../controller/user_controller'
import * as Message from '../utils/messages'

// controlla che "tokens" sia positivo
export function checkAmountPositive(req: any, res: any, next: any): void{
    if(req.body.tokens>0){
        next();
    }else{
        next(Message.bad_request_msg);
    }
}

// controlla che "user_email" sia un utente esistente
export function checkUserExists(req: any, res: any, next: any): void{
    UserController.getUser(req.body.user_email).then((value)=>{
        if(value){
            next();
        }else{
            next(Message.bad_request_msg);
        }
    });
}