'use strict'
const express = require('express');
const app = express();
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
require('dotenv').config()


// body parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))



// app.use(bodyParser());

// init middleware
app.use(morgan('dev')); // tô màu
// app.use(morgan('combined')); // tiêu chuẩn của apache 
// app.use(morgan('common')); //
app.use(helmet()); // bảo mật   
app.use(compression()); // nén dữ liệu trước khi gửi về client






// init routes

app.use(require('./routers'));

// init database
require('./dbs/init.mogodb');




// handle errors

app.use((req,res,next)=> {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status : 'error',
        code : statusCode,
        stack: error.stack,
        message : error.message || 'Internal error server'
    })
})



module.exports = app;