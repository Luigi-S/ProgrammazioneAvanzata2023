import * as Feed from '../model/Feed'
import * as Users from '../model/Users'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

export function createFood(req:any, res:any, next:any){
    const name: string =  req.body.name;
    const quantity: number =  req.body.quantity;
    Feed.createFood(name, quantity).then((food) => {
      Users.payToken(req.body.user.email);
      res.status(HttpStatus.CREATED).json({message: Message.food_created_message, food: food});
      next();
    }).catch((err) => {next(Error(Message.internal_server_error_message)); });
}

export async function checkFoodExists(id: number){
    const food = await Feed.getFood(id);
    return food;
}

export async function checkFoodExistsByName(name: string){
    const food = await Feed.getFoodByName(name);
    return food;
}

export function updateFood(req:any, res:any, next:any){
    const id: number = req.params.id
    const name: string =  req.body.name;
    const quantity: number =  req.body.quantity;
    
    Feed.updateFood(id, quantity, name).then((food) => {
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.food_updated_message, food: food});
        next();
    }).catch((err) => {
        if(err.message === Message.bad_request_msg){
            next(err);
        } else{
            next(Error(Message.internal_server_error_message));
        }
    });
}
