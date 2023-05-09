const JWT = require('jsonwebtoken');
const asynHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserID } = require('../services/keyToken.services');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}


const  creatTokenPair =  async (payload, publicKey, privateKey) => {
        // access token
        const accessToken = await  JWT.sign(payload, publicKey, {
            // algorithm : 'RS256',
            expiresIn : '2 days'
        });

        // refresh token
        const refreshToken =  await JWT.sign(payload, privateKey, {
            // algorithm : 'RS256',
            expiresIn : '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode)=> {
            if (err) {
                console.log(`error verify:: ${err}`);
            }else{
                console.log(`decode verify::`,decode);
            }
        })

        return {accessToken, refreshToken};
}


const authentication = asynHandler(async (req,res,next) => {
    /**
     * 1- check userID missing
     * 2- get accessToken
     * 3- verify Token
     * 4- check user in dbs
     * 5- check keyStore with userID
     * 6- OK all => return next
     */
    const userID = req.headers[HEADER.CLIENT_ID];
    if (!userID) {
        throw new  AuthFailureError('Invalid request');
    }
    const keyStore = await findByUserID(userID);
    if (!keyStore) {
        throw new NotFoundError("Not found keyStore");
    }
    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError("Invalid request");
    }
    try {
        const deocodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userID !== deocodeUser.userID) {
            throw new AuthFailureError("Invalid request");
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }
})

module.exports = {
    creatTokenPair, 
    authentication 
}

