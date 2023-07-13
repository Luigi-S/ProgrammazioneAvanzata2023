import * as Feed from '../model/Feed'
import * as Orders from '../model/Orders'
import * as Loads from '../model/Loads'
import * as Message from '../utils/messages'
import * as OrderController from '../controller/order_controller'

const DATE_FORMATS = ['DD-MM-YYYY', 'DD/MM/YYYY'];

export function checkValidOrder(req: any, res: any, next: any): void{
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    if(!loads.length){
        next(Error(Message.bad_request_msg));
    }
    let keys = new Set<number>();
    loads.forEach((elem)=>{
        keys.add(elem.food);
    });
    if(keys.size < loads.length){
        next(Error(Message.repeated_food_message));
    }
    
    loads.forEach((elem)=>{
        if(elem.quantity > 0){
            Feed.getFood(elem.food).then((value:Feed.Food)=>{
                console.log(value);
                if(value){
                    if(value.quantity < elem.quantity){
                        next(Error(Message.exceeded_quantity_message));    
                    }
                }else{
                    next(Error(Message.unexisting_food_message));
                }
            });
        }else{
            // q<0
            next(Error(Message.bad_request_msg));
        }
    });
    next();
}

export function checkOrderExists(req: any, res: any, next: any): void{
    Orders.getOrder(req.params.id).then((value)=>{
        console.log(value);
        if(value){
            req.body.order = value;
            next();
        }else{
            // order does not exist
            next(Error(Message.bad_request_msg));
        }
    }).catch((err)=>{
        console.log(err);
        next(Error(Message.bad_request_msg));});
}

export function checkInExecution(req: any, res: any, next: any): void{
    if(req.body.order.state !== Orders.OrderState.IN_ESECUZIONE){
        next(Error(Message.not_executing_order_message));
    }else{
        next();
    }
}

export function checkOrderNotStarted(req: any, res: any, next: any): void{
    if(req.body.order.state==Orders.OrderState.CREATO){
        next();
    }else{
        // richiesta già presa in carico, completata o fallita -> non è possibile prenderela in carico
        next(Error(Message.already_taken_order_message));
    }
}

export function checkFoodIdExists(req:any, res:any, next:any){
    Feed.getFood(req.params.food).then((value)=>{
        if(value){
            next();
        }else{
            next(Error(Message.unexisting_food_message));
        }
    }).catch((err)=>{

        console.log(err);
        next(Error(Message.bad_request_msg));
    });
}

export function checkIfNext(req: any, res: any, next: any): void{
    
    Loads.getNext(req.params.id).then((value)=>{
        if(!value){
            next(Error(Message.not_next_message));
        }
        if(value.foodid === req.body.food){
            req.body.requested_q = value.requested_q;
            req.body.food = value.Food.dataValues;
            next();
        }else{
            OrderController.failOrder(value.orderid);
            next(Error(Message.not_next_message));
        }
    });
}

export function checkActualQuantity(req: any, res: any, next: any): void{ 
    require('dotenv').config();
    const N: number = parseFloat(process.env.N as string)/100;
    const min_accepted = req.body.requested_q*(1-N);
    const max_accepted = req.body.requested_q*(1+N);
    console.log(min_accepted);
    console.log(max_accepted);
    if(req.body.quantity>=min_accepted && req.body.quantity<=max_accepted){
        next();
    }else{
        OrderController.failOrder(req.params.id);
        next(Error(Message.unacceptable_q_message));
    }
}

export function checkStoredQuantity(req: any, res: any, next: any): void{ 
    if(req.body.quantity<=req.body.food.quantity){
        next();
    }else{
        OrderController.failOrder(req.params.id);
        next(Error(Message.not_enough_stored_message));
    }
}

export function checkValidPeriod(req: any, res: any, next: any): void{ 
    const moment = require('moment');
    const start: string = req.query.start;
    const end: string = req.query.end;
    console.log(req.query.start);
    console.log(req.query.end);
    if((moment(start, DATE_FORMATS, true).isValid() || !start) &&
        (moment(end, DATE_FORMATS, true).isValid() || !end)){
            if(start || end){
                try{
                    const start_arr = start? start.split(/[-/]/).map((val:string)=>parseInt(val)): undefined;
                    const end_arr = end? end.split(/[-/]/).map((val:string)=>parseInt(val)): undefined;

                    console.log(start_arr);
                    console.log(end_arr);

                    req.query.start = start_arr? new Date(start_arr[2],start_arr[1], start_arr[0]) : undefined;
                    req.query.end = end_arr? new Date(end_arr[2], end_arr[1], end_arr[0]) : undefined;
                
                    console.log(req.query.start);
                    console.log(req.query.end);
                    if(req.query.start && req.query.end && req.query.end<=req.query.start){
                        next(Error(Message.bad_request_msg));
                    }
                }catch(err){
                    console.log(err);
                
                    next(Error(Message.bad_request_msg));
                }
            }
            next();
    }else{
        next(Error(Message.bad_request_msg));
    }
}
