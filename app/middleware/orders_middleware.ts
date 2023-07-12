import * as Feed from '../model/Feed'
import * as Orders from '../model/Orders'
import * as Loads from '../model/Loads'
import * as Message from '../utils/messages'
import * as OrderController from '../controller/order_controller'
import { error } from 'console'

const DATE_FORMATS = ['DD-MM-YYYY', 'DD/MM/YYYY'];

export function checkValidOrder(req: any, res: any, next: any): void{
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    if(!loads.length){
        next(Error(Message.bad_request_msg));
    }

    loads.forEach((elem)=>{
        if(elem.quantity > 0){
            Feed.getFood(elem.food).then((value:any)=>{
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
    Orders.getOrder(req.params.id).then((value:any)=>{
        if(value){
            req.body.order = value;
            next();
        }else{
            // order does not exist
            next(Error(Message.bad_request_msg));
        }
    });
}

export function checkOrderNotStarted(req: any, res: any, next: any): void{
    if(req.body.order.state==Orders.OrderState.CREATO){
        next();
    }else{
        // richiesta già presa in carico, completata o fallita -> non è possibile prenderela in carico
        next(Error(Message.already_taken_order_message));
    }
}

export function checkIfNext(req: any, res: any, next: any): void{
    Loads.getNext(req.params.id).then((value:any)=>{
        if(value.food.id === req.body.food){
            req.body.food = value.food;
            next();
        }else{
            OrderController.failOrder(value.order);
            next(Error(Message.not_next_message));
        }
    });
}

export function checkActualQuantity(req: any, res: any, next: any): void{ 
    require('dotenv').config();
    req =req.body;
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
    if(req.body.quantity<=req.body.food.quantity){
        next();
    }else{
        // TODO anche in questo caso è FALLITO?
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
