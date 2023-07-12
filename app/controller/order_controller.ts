import * as Feed from '../model/Feed'
import * as Users from '../model/Users'
import * as Loads from '../model/Loads'
import * as Orders from '../model/Orders'
import * as Message from '../utils/messages'

var HttpStatus = require('http-status-codes');

export function createOrder(req:any, res:any, next:any){
    const loads : Array<{food: number, quantity: number}> =  req.body.loads;
    let arr : Array<{foodid: number, orderid: number, requested_q: number, index: number,}>= [];

    Orders.createOrder().then((order:any)=>{
        loads.forEach((value, index) =>{
            arr.push({foodid: value.food, orderid: order.id, requested_q: value.quantity, index:index});
        });
        Loads.createLoads(arr).then((loads) => {
            Users.payToken(req.body.user.email);
            res.status(HttpStatus.CREATED).json({message: Message.order_created_message, orderid: order, loads: loads});
            next();
        }).catch((err) => {
            Orders.destroyOrder(order.id).then((value)=>{
                next(Error(Message.internal_server_error_message));
            });
        });
    });
    
}

export function takeOrder(req:any, res:any, next:any){
    Orders.setState(req.params.id, Orders.OrderState.IN_ESECUZIONE).then((value)=>{
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.order_taken_message, order: value});
        next();
    });
}

export function getOrderState(req:any, res:any, next:any){
    const order: any = req.body.order;
    if(order.state == Orders.OrderState.COMPLETATO){
        Loads.getLoadsByOrder(order.id).then((value)=>{
            Users.payToken(req.body.user.email);
            res.status(HttpStatus.OK).json({orderid: order.id, loads: value});
            next();
        });
    }else if(order.state == Orders.OrderState.IN_ESECUZIONE){
        Loads.getCompletedOrder(order.id).then((value)=>{
            let loads : Array<{food: number, requested_q: number, actual_q: number, diff_q: number }>;
            value.forEach((elem: any)=>{
                loads.push({
                    food: elem.food,
                    requested_q: elem.requested_q,
                    actual_q: elem.actual_q,
                    diff_q: (elem.requested_q-elem.actual_q)
                });
            });
            Users.payToken(req.body.user.email);
            res.status(HttpStatus.OK).json({orderid: order.id, duration: (order.finish - order.start), loads: loads});
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

        value.forEach((elem: any)=>{
            console.log(elem);
            const load = {
                food: elem.food,
                requested_q: elem.requested_q,
                actual_q: elem.actual_q,
                index: elem.index,
                timestamp: elem.timestamp
            };
            if(retval[elem.order].id){
                retval[elem.order.id].loads.push(load);
            }else{
                retval[elem.order.id] = {
                    state: elem.order.state,
                    start: elem.order.start,
                    finish: elem.order.finish,
                    loads:[load]};
            }
        });
        console.log(retval);
        res.status(HttpStatus.OK).json({start: req.query.start, end: req.query.end, loads: retval});
        next();
    });
}

export async function failOrder(orderid: number){
    const order = await Orders.setState(orderid, Orders.OrderState.FALLITO);
    return order;
}

export async function completeOrder(orderid: number){
    const order = await Orders.setState(orderid, Orders.OrderState.COMPLETATO);
    return order;
}

async function addLoadAsync(req:any, res:any){
    const body = req.body;
    const load: any = await Loads.doLoad(body.order.id, body.food.id, body.quantity);
    await Feed.takeFood(body.quantity, body.food.id);
    const nxt: any = await Loads.getNext(req.params.id);
    if(nxt.index === load.index){
        await completeOrder(req.params.id);
    }
}

export function addLoad(req:any, res:any, next:any){
    addLoadAsync(req, res).then(()=>{
        Users.payToken(req.body.user.email);
        res.status(HttpStatus.OK).json({message: Message.success_load_message});
        next();
    }).catch((err)=>{next(err);});
}