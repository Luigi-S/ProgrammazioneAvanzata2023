"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Middleware = require("./middleware/cor");
var PORT = 8080;
var HOST = '0.0.0.0';
var app = express();
// app.use('/', require("./routes/pages"));
app.use(express.json());
app.get('/canidi', function (req, res) {
    res.send('Hello World');
});
/**
 * Gestione delle rotte non previste
 */
app.get('*', Middleware.any_other, Middleware.error_handling);
app.post('*', Middleware.any_other, Middleware.error_handling);
app.listen(PORT, HOST, function (err) {
    if (err)
        return console.log("Cannot Listen on PORT: ".concat(PORT));
    console.log("Server is Listening on: http://".concat(HOST, ":").concat(PORT, "/"));
});
