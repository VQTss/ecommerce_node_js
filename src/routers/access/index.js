'use strict'

const express = require('express');
const router = express.Router()
const accessControllers = require('../../controllers/controllers.access')
const asynHandler = require('../../helpers/asyncHandler');
const { authentication , authenticationV2 } = require('../../auth/authUtils');



// sign up 

router.post('/shop/signup',asynHandler(accessControllers.signUp));
router.post('/shop/login', asynHandler(accessControllers.login))
////////////////////////////////////////
// AUTHENTICATION
router.use(authenticationV2);
////////////////////////////////////////
router.post('/shop/logout', asynHandler(accessControllers.logout));
router.post('/shop/handleRefreshToken', asynHandler(accessControllers.handlerRefreshToken));



module.exports = router;

