import * as express from 'express';
import * as Middleware from './middleware/cor'

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
// app.use('/', require("./routes/pages"));

app.use(express.json());


app.get('/canidi', (req, res) => {
  res.send('Hello World');
});


/** 
 * Gestione delle rotte non previste
 */ 
app.get('*', Middleware.any_other, Middleware.error_handling);
app.post('*', Middleware.any_other, Middleware.error_handling);

app.listen(PORT, HOST, err => {
  if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
  console.log(`Server is Listening on: http://${HOST}:${PORT}/`);
  }
);