import * as express from 'express';
import * as Middleware from './middleware/cor'

import { ErrorWithStatus, getErrorWithStatus } from './utils/errors';
import * as Message from './utils/messages'

import * as FoodController from './controller/food_controller'
import * as OrderController from './controller/order_controller'
import * as AdminController from './controller/admin_controller'

const PORT = 8080;
const HOST = '0.0.0.0';

const fs = require("fs");
export const public_key = fs.readFileSync('jwtRS256.key.pub');

const app = express();

app.use(express.json());
// TODO remove, probabilemnte sovrabbondante, ho fatto già il middleware
app.use((err: Error, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError) {
    let new_err: ErrorWithStatus = getErrorWithStatus(Error(Message.malformed_payload_message));
    res.status(new_err.status).json(new_err.err.message);
  }
  next();
});

// ROTTE
// 1) POST /food -> creazione alimento + name, quantity
app.post('/food', Middleware.auth, Middleware.validNewFood, Middleware.error_handling, function (req: any, res: any) {    
  FoodController.createFood(req, res);
});

// 2) PUT /food/ <id> -> modifica alimento <id> + name, quantity (opzionali)
app.put('/food/:id', Middleware.auth, Middleware.validUpdFood, Middleware.error_handling, function (req: any, res: any) {    
  FoodController.updateFood(req, res);
});

// 3) POST /order -> creazione ordine + loads:[ food, quantity]
// TODO probabilmente singola rotta più complessa(?)
app.post('/order', Middleware.auth, Middleware.validOrder, Middleware.error_handling, function (req: any, res: any) {    
  OrderController.createOrder(req, res);
});

// 4) POST /order/<id_order> -> Presa in carico ordine <id_order>
app.post('/order/:id', Middleware.auth, Middleware.takeOrder, Middleware.error_handling, function (req: any, res: any) {    
  OrderController.takeOrder(req, res);
});

// 5) GET /order/<id_order> -> dati ordine <id_order>
app.get('/order/:id', Middleware.auth, Middleware.orderState,Middleware.error_handling, function (req: any, res: any) {    
  OrderController.getOrderState(req,res);
});

// 6) GET /list -> <NO-JWT> ottenere lista degli ordini + start, end (query params opzionali)
app.get('/list', Middleware.validPeriod, function (req: any, res: any) {
  OrderController.getOrderList(req, res);
});

// 7) POST /load/<id_order> -> carico alimento per ordine <id_order> + food, quantity
app.post('/load/:id', Middleware.auth, Middleware.addLoad, Middleware.error_handling, function (req: any, res: any) {    
  OrderController.addLoad(req, res);
});

// 8) POST /admin/token -> re-impostare il numero token di un utente + user_id, token_amount
app.post('/admin/token', Middleware.isAdmin, Middleware.updToken, Middleware.error_handling, function (req: any, res: any) {    
  AdminController.updateToken(req, res);
});



/** 
 * Gestione delle rotte non previste
 */ 
app.get('*', Middleware.any_other, Middleware.error_handling);
app.post('*', Middleware.any_other, Middleware.error_handling);
app.put('*', Middleware.any_other, Middleware.error_handling);

app.listen(PORT, HOST, err => {
  if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
  console.log(`Server is Listening on: http://${HOST}:${PORT}/`);
  }
);