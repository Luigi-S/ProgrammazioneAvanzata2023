import * as Feed from '../model/Feed'
import * as Orders from '../model/Orders'
import * as Message from '../utils/messages'

export function checkValidOrder(req: any, res: any, next: any): void{
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    if(!loads.length){
        next(Error(Message.bad_request_msg));
    }

    loads.forEach((elem)=>{
        if(elem.quantity > 0){
            Feed.getFood(elem.food).then((value:any)=>{
                if(value){
                    if(value.quantity < elem.quantity){
                        next(Error(Message.exceeded_quantity_message));    
                    }
                }else{
                    next(Error(Message.unexisting_food_message));
                }
            });
            // TODO aggiungere .catch()?
        }else{
            // q<0
            next(Error(Message.bad_request_msg));
        }
    });
    next();
}

export function checkOrderExists(req: any, res: any, next: any): void{
    Orders.getOrder(req.params.id).then((value:any)=>{
        if(value){
            req.order = value;
            next();
        }else{
            // order does not exist
            next(Error(Message.bad_request_msg));
        }
    });
}

export function checkOrderNotStarted(req: any, res: any, next: any): void{
    if(req.order.state==Orders.OrderState.CREATO){
        next();
    }else{
        // richiesta già presa in carico, completata o fallita -> non è possibile prenderela in carico
        next(Error(Message.already_taken_order_message));
    }
}