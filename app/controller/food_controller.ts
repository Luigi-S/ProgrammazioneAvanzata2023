import * as Feed from '../model/Feed'
import * as Users from '../model/Users'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

/**
 * 
 * @param req 
 * @param res 
 * @param next
 * 
 * Funzione per creazione di un nuovo alimento: "name" + "quantity" nel req.body
 * "name" non può essere già presente a DB, "quantity" deve essere positiva
 * Costo: 1 token per "user" 
 */
export function createFood(req:any, res:any, next:any){
    const name: string =  req.body.name;
    const quantity: number =  req.body.quantity;
    Feed.createFood(name, quantity).then((food: Feed.Food) => {
      Users.payToken(req.body.user.email);
      res.status(HttpStatus.CREATED).json({message: Message.food_created_message, food: food});
      next();
    }).catch((err) => {next(Message.internal_server_error_message); });
}

// funzione impiegata nel middleware, restituisce, se esiste, l'istanza di food corrispondente "id"
export async function checkFoodExists(id: number){
    const food = await Feed.getFood(id);
    return food;
}

// funzione impiegata nel middleware, restituisce, se esiste, l'istanza di food corrispondente  il nome(unico) "name"
export async function checkFoodExistsByName(name: string){
    const food = await Feed.getFoodByName(name);
    return food;
}

/**
 * 
 * @param req 
 * @param res 
 * @param next
 * 
 * Funzione per aggiornamento di un alimento indicato da "id" come parametro della rotta, indicato: "name" + "quantity" nel req.body, 
 * "name" non può essere già presente a DB, "quantity" deve essere positiva, possono essere nulli, in tal caso non si aggiorna tale campo
 * Costo: 1 token per "user" 
 */
export function updateFood(req:any, res:any, next:any){
    const id: number = req.params.id
    const name: string =  req.body.name;
    const quantity: number =  req.body.quantity;
    
    Feed.updateFood(id, quantity, name).then((food) => {
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.food_updated_message, food: food});
        next();
    }).catch((err) => {
        if(err.message === Message.bad_request_msg.msg){
            next(Message.bad_request_msg);
        } else{
            next(Message.internal_server_error_message);
        }
    });
}
