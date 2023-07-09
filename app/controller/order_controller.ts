import * as Feed from '../model/Feed'
import * as Users from '../model/Users'
import * as Loads from '../model/Loads'
import * as Orders from '../model/Orders'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

export function createOrder(req:any, res:any){
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    let arr : Array<{food: number, order: number, requested_q: number, index: number,}>= [];
    
    
    Orders.createOrder().then((order:any)=>{
        loads.forEach((value, index) =>{
            arr.push({food: value.food, order: order.id, requested_q: value.quantity, index:index});
        });
        Loads.createLoads(arr).then((loads) => {
            Users.payToken(req.user.email);
            res.status(HttpStatus.CREATED).json({message: Message.order_created_message, order: order, loads: loads});
        }).catch((err) => {
            Orders.destroyOrder(order.id).then((value)=>{
                throw Error(Message.internal_server_error_message)
            }).catch((err)=> {
                console.log(err.message);
                throw Error(Message.internal_server_error_message)
            });
        });
    }).catch((err) => {
        console.log(err.message);
        throw Error(Message.internal_server_error_message)
    });
    
}

export function takeOrder(req:any, res:any){
    Orders.setState(req.params.id, Orders.OrderState.IN_ESECUZIONE).then((value)=>{
        Users.payToken(req.user.email);
        res.status(HttpStatus.OK).json({message: Message.order_taken_message, order: value});
    });
}
