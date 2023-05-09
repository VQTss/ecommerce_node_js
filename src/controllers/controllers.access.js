
'use strict'
const AccessService = require('../services/access.services');
const {OK , CREATED , SuccessResponse} = require('../core/success.response')

class AccessControllers {

    handlerRefreshToken = async(req, res, next) => {

        // new SuccessResponse ( {
        //     message: "Get token success!",
        //     metadata : await AccessService.handlerRefreshToken(req.keyStore.refreshToken),
        // }).send(res)


        // v2 fixed , no need access token
        new SuccessResponse ( {
            message: "Get token success!",
            metadata : await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user : req.user,
                keyStore : req.keyStore
            }),
        }).send(res)
    }


    logout = async(req, res, next) => {

        new SuccessResponse ( {
            message: "Logout success!",
            metadata : await AccessService.logout(req.keyStore),
        }).send(res)

    }

    login = async(req, res, next) => {

        new SuccessResponse ( {
            metadata : await AccessService.login(req.body),
        }).send(res)

    }

    signUp = async (req, res, next) => {

        new CREATED ({
            message : 'Registerted OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)  
    }
}

module.exports = new AccessControllers();

