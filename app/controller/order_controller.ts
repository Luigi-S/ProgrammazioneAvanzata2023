import * as Feed from '../model/Feed'
import * as Users from '../model/Users'
import * as Loads from '../model/Loads'
import * as Orders from '../model/Orders'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

export function createOrder(req:any, res:any, next:any){
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    let arr : Array<{foodid: number, orderid: number, requested_q: number, index: number,}>= [];

    Orders.createOrder().then((order:Orders.Order)=>{
        loads.forEach((value, index) =>{
            arr.push({foodid: value.food, orderid: order.id, requested_q: value.quantity, index:index});
        });
        Loads.createLoads(arr).then((loads) => {
            Users.payToken(req.body.user.email);
            res.status(HttpStatus.CREATED).json({message: Message.order_created_message, orderid: order, loads: loads});
            next();
        }).catch((err) => {
            Orders.destroyOrder(order.id).then(()=>{
                next(Message.internal_server_error_message);
            });
        });
    });
    
}

export function takeOrder(req:any, res:any, next:any){
    Orders.takeOrder(req.params.id).then((value)=>{
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.order_taken_message, order: value});
        next();
    });
}

export function getOrderState(req:any, res:any, next:any){
    const order = req.body.order;
    if(order.state == Orders.OrderState.IN_ESECUZIONE){
        Loads.getLoadsByOrder(order.id).then((value)=>{
            Users.payToken(req.body.user.email);
            res.status(HttpStatus.OK).json({orderid: order.id, loads: value});
            next();
        });
    }else if(order.state == Orders.OrderState.COMPLETATO){
        Loads.getCompletedOrder(order.id).then((value)=>{
            let loads : Array<{food: number, requested_q: number, actual_q: number, diff_q: number }> =[];
            value.forEach((elem: any)=>{
                loads.push({
                    food: elem.food,
                    requested_q: elem.requested_q,
                    actual_q: elem.actual_q,
                    diff_q: (elem.requested_q-elem.actual_q)
                });
            });
            Users.payToken(req.body.user.email);
            let diff = '';
            if (order.finish && order.start){
                diff = ((order.finish.getTime() - order.start.getTime()) / (1000*60*60)).toFixed(2) + ' ore';
            }
            res.status(HttpStatus.OK).json({orderid: order.id, duration: diff , loads: loads});
            next();
        });
    }else{
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({orderid: order.id, message: Message.no_loads_msg, loads: null });
        next();
    }
}

export function getOrderList(req:any, res:any, next:any){
    Loads.getLoadsInPeriod(req.query.start, req.query.end).then((value)=>{
        let retval ={};

        value.forEach((loads)=>{
            const elem = loads.dataValues;
            const load = {
                food: elem.foodid,
                requested_q: elem.requested_q,
                actual_q: elem.actual_q,
                index: elem.index,
                timestamp: elem.timestamp
            };
            if(retval[elem.orderid]){
                retval[elem.orderid].loads.push(load);
            }else{
                retval[elem.orderid] = {
                    state: elem.Order.state,
                    start: elem.Order.start,
                    finish: elem.Order.finish,
                    loads:[load]};
            }
        });
        res.status(HttpStatus.OK).json({start: req.query.start, end: req.query.end, loads: retval});
        next();
    }).catch((err)=>{
        console.log(err);
        next(Message.internal_server_error_message);
    }); // TODO implementare caso di data malformed
}

export async function failOrder(orderid: number){
    const order = await Orders.setState(orderid, Orders.OrderState.FALLITO);
    return order;
}

export async function completeOrder(orderid: number){
    const order = await Orders.finishOrder(orderid);
    return order;
}

async function addLoadAsync(req:any, res:any){
    const body = req.body;
    await Loads.doLoad(body.order.id, body.food.id, body.quantity);
    await Feed.takeFood(body.quantity, body.food.id);
    const nxt: any = await Loads.getNext(req.params.id);
    if(!nxt){
        // IF nxt == undefined, ho consluso l'ordine.
        await completeOrder(req.params.id);
    }
}

export function addLoad(req:any, res:any, next:any){
    addLoadAsync(req, res).then(()=>{
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.success_load_message});
        next();
    }).catch((err)=>{next(Message.internal_server_error_message);});
}