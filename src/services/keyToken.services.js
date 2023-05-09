'use strict'

const keyTokenModel = require("../models/keyToken.model");
class KeyTokenService {

    static createKeyToken =  async ({userID , publicKey, privateKey , refreshToken}) => {
            try {
                // dang buffer chuyen ve string de luu ve database
                // const publicKeyString = publicKey.toString();
                // const tokens = await keyTokenModel.create({
                //     user: userID , 
                //     publicKey :  publicKey,
                //     privateKey: privateKey  
                // })
                // return  tokens ?  tokens.publicKey : null

                // Level xxx
                const filter  = {user: userID} , update = {
                    publicKey, privateKey, refreshTokensUsed : [] , refreshToken
                }, options = {
                    upsert:true, new:true,
                }
                const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
                return tokens ? tokens.publicKey : null;

            } catch (error) {
                return error;
            }
    }
    
    static findByUserID = async ( userID ) => {
        const found = await keyTokenModel.findOne({user: userID});
        return found;
    }

    static removeKeyByID = async (id) =>{
        const remove  =  await keyTokenModel.deleteMany({_id: id}).lean();
        return remove;
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({refreshToken});
    }
    static deleteKeyByID = async ( userID) => {
        return keyTokenModel.deleteOne({ user: userID });
    }

}

module.exports = KeyTokenService;