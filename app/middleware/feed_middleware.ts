import * as Message from '../utils/messages'
import * as FoodController from '../controller/food_controller'

export function checkQuantityPositive (req: any, res: any, next: any): void{
    try {
        if(req.body.quantity > 0){
            next();
        }else{
            next(Message.malformed_payload_message);
        }
    } catch (error) { 
        next(Message.malformed_payload_message);
    }
}

export function checkFoodExists (req: any, res: any, next: any): void{
    FoodController.checkFoodExists(req.params.id).then((value)=>{
        if(value){
            next();
        }else{
            next(Message.unexisting_food_message);
        }
    }).catch((error) => { 
        next(Message.malformed_payload_message);
    });
}

export function checkFoodExistsByName (req: any, res: any, next: any): void{
    FoodController.checkFoodExistsByName(req.body.name).then((value)=>{
        if(!value){
            next();
        }else{
            next(Message.already_existing_food_message);
        }
    }).catch((error) => { 
        next(Message.malformed_payload_message);
    });
}