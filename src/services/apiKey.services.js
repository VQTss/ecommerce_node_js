const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto');

const findByID = async (key) => {
    const newAPIKey = await  apikeyModel.create( { key : crypto.randomBytes(64).toString('hex'), permissions: '0000' })
    console.log(newAPIKey);

    const objKey = await apikeyModel.findOne({key : key, status: true}).lean()
    return objKey
}





module.exports = {
    findByID
};