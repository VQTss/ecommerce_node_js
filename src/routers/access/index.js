'use strict'

const express = require('express');
const router = express.Router()
const accessControllers = require('../../controllers/controllers.access')
const asynHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');



// sign up 

router.post('/shop/signup',asynHandler(accessControllers.signUp));
router.post('/shop/login', asynHandler(accessControllers.login))


router.use(authentication);

router.post('/shop/logout', asynHandler(accessControllers.logout));

module.exports = router;

