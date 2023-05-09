'use strict'
const mongoose = require('mongoose');
const {countConnections} = require('../helpers/check.connect');
const {db: {host,name,port}} = require('../config/config.mogodb')

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect()
    }

    // _connect()
    connect(type = 'mongodb') {

        if (process.env.NODE_ENV === 'dev') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString)
            .then(() => {
                console.log(`Connectring: ${connectString}`);
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error',err)
            })
    }

    
    static getInstace() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const intanceMongoDB = Database.getInstace();
module.exports = intanceMongoDB;