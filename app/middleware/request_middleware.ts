import { ErrorWithStatus, getErrorWithStatus } from '../utils/errors';
import * as Message from '../utils/messages'
import * as FoodController from '../controller/food_controller'

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

export function checkQuantityPositive (req: any, res: any, next: any): void{
    try {
        if(req.body.quantity > 0){
            next();
        }else{
            next(Error(Message.malformed_payload_message));
        }
    } catch (error) { 
        next(Error(Message.malformed_payload_message))
    }
}

export function checkFoodExists (req: any, res: any, next: any): void{
    FoodController.checkFoodExists(req.params.id).then((value)=>{
        if(value){
            next(); // TODO aggiungere value a req?
        }else{
            next(Error(Message.unexisting_food_message));
        }
    }).catch((error) => { 
        next(Error(Message.malformed_payload_message));
    });
}


export function logErrors(err: any, req: any, res: any, next: any): void {
    let new_err: ErrorWithStatus = getErrorWithStatus(err);
    console.log(new_err.toString());
    next(new_err);
}

export function errorHandler(error: ErrorWithStatus, req: any, res: any, next: any): void { 
    res.status(error.status).json(error.err.message);
}