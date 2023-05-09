'use strict'
const mongoose = require('mongoose');

const connectString = 'mongodb://127.0.0.1:27017/shopDev';



mongoose.connect(connectString).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

if (1 === 0) {
    mongoose.set('debug', true);
    mongoose.set('debug',{color: true});
}

module.exports = mongoose;  






