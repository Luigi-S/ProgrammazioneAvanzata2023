import * as Feed from '../model/Feed'
import * as Orders from '../model/Orders'
import * as Loads from '../model/Loads'
import * as Message from '../utils/messages'
import * as OrderController from '../controller/order_controller'

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

export function checkIfNext(req: any, res: any, next: any): void{
    Loads.getNext(req.params.id).then((value:any)=>{
        if(value.food.id === req.food){
            req.food = value.food;
            next();
        }else{
            OrderController.failOrder(value.order);
            next(Error(Message.not_next_message));
        }
    });
}

export function checkActualQuantity(req: any, res: any, next: any): void{ 
    require('dotenv').config();
    const N: number = parseInt(process.env.N as string)/100;
    const min_accepted = req.food.requested_q*(1-N);
    const max_accepted = req.food.requested_q*(1+N);
    if(req.quantity>min_accepted && req.quantity<max_accepted){
        next();
    }else{
        OrderController.failOrder(req.order.id);
        next(Error(Message.unacceptable_q_message));
    }
}

export function checkStoredQuantity(req: any, res: any, next: any): void{ 
    if(req.quantity<=req.food.quantity){
        next();
    }else{
        // TODO anche in questo caso è FALLITO?
        next(Error(Message.not_enough_stored_message));
    }
}
