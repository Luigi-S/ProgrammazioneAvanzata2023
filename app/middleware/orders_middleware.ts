import * as Feed from '../model/Feed'
import * as Orders from '../model/Orders'
import * as Loads from '../model/Loads'
import * as Message from '../utils/messages'
import * as OrderController from '../controller/order_controller'

const DATE_FORMATS = ['DD-MM-YYYY', 'DD/MM/YYYY'];
/**
 * Validazione ordine: req.body ha un array "loads", ogni elemento di tale array è così composto:
 * "food" : id dell'alimento, "quantity" : quantità da caricare
 * 
 * Errori:
 * Malformed request, quantità negativa o nulla, array vuoto -> bad request
 * "requested_quantity" superiore a dispponibilità di food("quantity") -> exceeded quantity
 * Alimento non esistente -> unexisting food
 */
export function checkValidOrder(req: any, res: any, next: any): void{
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    if(!loads.length){
        next( Message.bad_request_msg);
    }
    let keys = new Set<number>();
    loads.forEach((elem)=>{
        keys.add(elem.food);
    });
    if(keys.size < loads.length){
        next( Message.repeated_food_message);
    }
    
    loads.forEach((elem)=>{
        if(elem.quantity > 0){
            Feed.getFood(elem.food).then((value:Feed.Food)=>{
                console.log(value);
                if(value){
                    if(value.quantity < elem.quantity){
                        next( Message.exceeded_quantity_message);    
                    }
                }else{
                    next( Message.unexisting_food_message);
                }
            });
        }else{
            // q<0
            next( Message.bad_request_msg);
        }
    });
    next();
}


/**
 * Controllo che l'ordine indicato da parametro "id" esista, altrimenti -> bad request 
 */
export function checkOrderExists(req: any, res: any, next: any): void{
    Orders.getOrder(req.params.id).then((value)=>{
        if(value){
            req.body.order = value;
            next();
        }else{
            next( Message.bad_request_msg);
        }
    }).catch((err)=>{
        console.log(err);
        next( Message.bad_request_msg);});
}


/**
 * Controllo che l'ordine indicato da parametro "id" abbia "state" pari ad IN_ESECUZIONE, altrimenti -> not executing 
 */
export function checkInExecution(req: any, res: any, next: any): void{
    if(req.body.order.state !== Orders.OrderState.IN_ESECUZIONE){
        next( Message.not_executing_order_message);
    }else{
        next();
    }
}


/**
 * Controllo che l'ordine indicato da parametro "id" abbia stato "CREATO", altrimenti -> already taken
 */
export function checkOrderNotStarted(req: any, res: any, next: any): void{
    if(req.body.order.state==Orders.OrderState.CREATO){
        next();
    }else{
        // richiesta già presa in carico, completata o fallita -> non è possibile prenderela in carico
        next( Message.already_taken_order_message);
    }
}

/**
 * Controllo che l'alimento indicato da parametro "food" esista, altrimenti -> unexisting food 
 */
export function checkFoodIdExists(req:any, res:any, next:any){
    Feed.getFood(req.body.food).then((value)=>{
        if(value){
            next();
        }else{
            next( Message.unexisting_food_message);
        }
    }).catch((err)=>{

        console.log(err);
        next( Message.bad_request_msg);
    });
}

/**
 * Controllo che l'alimento indicato da parametro "food" sia effettivamente il prossimo della sequenza di carichi dell'ordine "id", altrimenti -> not next
 */
export function checkIfNext(req: any, res: any, next: any): void{
    
    Loads.getNext(req.params.id).then((value)=>{
        if(!value){
            next( Message.not_next_message);
        }
        if(value.foodid === req.body.food){
            req.body.requested_q = value.requested_q;
            req.body.food = value.Food.dataValues;
            next();
        }else{
            OrderController.failOrder(value.orderid);
            next( Message.not_next_message);
        }
    });
}


/**
 * Verifica che la quantità "quantity" effettivamente caricata si trovi in un range del N% (paramentro salvato in dotenv)
 * del valore "requested_q" per lo stesso alimento nell'ordine, altrimenti -> unacceptable q
 */
export function checkActualQuantity(req: any, res: any, next: any): void{ 
    require('dotenv').config();
    const N: number = parseFloat(process.env.N as string)/100;
    const min_accepted = req.body.requested_q*(1-N);
    const max_accepted = req.body.requested_q*(1+N);
    if(req.body.quantity>=min_accepted && req.body.quantity<=max_accepted){
        next();
    }else{
        OrderController.failOrder(req.params.id);
        next( Message.unacceptable_q_message);
    }
}

/**
 * Verifica che la quantità "quantity" effettivamente caricata sia inferiore o uguale a quella complessiva dell'alimento
 * Se non è così, l'ordine fallisce
 */
export function checkStoredQuantity(req: any, res: any, next: any): void{ 
    if(req.body.quantity<=req.body.food.quantity){
        next();
    }else{
        OrderController.failOrder(req.params.id);
        next( Message.not_enough_stored_message);
    }
}

/**
* Verifica che le date "start" ed "end", se presenti, sono correttamente formattate, nei formati espressi in DATEFORMATS,
* Inoltre, se entrambi presenti, che la fine sia successiva all'inizio del periodo
*/
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
                        next( Message.bad_request_msg);
                    }
                }catch(err){
                    console.log(err);
                
                    next( Message.bad_request_msg);
                }
            }
            next();
    }else{
        next( Message.bad_request_msg);
    }
}
