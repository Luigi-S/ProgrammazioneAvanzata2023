import * as express from 'express';
import * as Middleware from './middleware/cor'

import * as FoodController from './controller/food_controller'
import * as OrderController from './controller/order_controller'
import * as AdminController from './controller/admin_controller'

const PORT = parseInt(process.env.PORT as string);
const HOST = process.env.HOST;

const fs = require("fs");
export const public_key = fs.readFileSync('jwtRS256.key.pub');

const app = express();

app.use(express.json());
// ROTTE
// 1) POST /food -> creazione alimento + name, quantity
app.post('/food', Middleware.auth, Middleware.validNewFood, function (req: any, res: any, next:any) {
  FoodController.createFood(req, res, next);
});

// 2) PUT /food/ <id> -> modifica alimento <id> + name, quantity (opzionali)
app.put('/food/:id', Middleware.auth, Middleware.validUpdFood, function (req: any, res: any, next:any) {
  FoodController.updateFood(req, res, next);
});

// 3) POST /order -> creazione ordine + loads:[ food, quantity]
// TODO probabilmente singola rotta più complessa(?)
app.post('/order', Middleware.auth, Middleware.validOrder,  function (req: any, res: any, next:any) {    
  OrderController.createOrder(req, res, next);
});

// 4) POST /order/<id_order> -> Presa in carico ordine <id_order>
app.post('/order/:id', Middleware.auth, Middleware.takeOrder, function (req: any, res: any, next:any) {
  OrderController.takeOrder(req, res, next);
});

// 5) GET /order/<id_order> -> dati ordine <id_order>
app.get('/order/:id', Middleware.auth, Middleware.orderState, function (req: any, res: any, next:any) {
  OrderController.getOrderState(req,res, next);
});

// 6) GET /list -> <NO-JWT> ottenere lista degli ordini + start, end (query params opzionali)
app.get('/list', Middleware.validPeriod, function (req: any, res: any, next:any) {
  OrderController.getOrderList(req, res, next);
});

// 7) POST /load/<id_order> -> carico alimento per ordine <id_order> + food, quantity
app.post('/load/:id', Middleware.auth, Middleware.addLoad, function (req: any, res: any, next:any) {    
  OrderController.addLoad(req, res, next);
});

// 8) POST /admin/token -> re-impostare il numero token di un utente + user_id, token_amount
app.post('/admin/token', Middleware.isAdmin, Middleware.updToken, function (req: any, res: any, next:any) {    
  AdminController.updateToken(req, res, next);
});

// TODO remove, probabilemnte sovrabbondante, ho fatto già il middleware
app.use(Middleware.error_handling);



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