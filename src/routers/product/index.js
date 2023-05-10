'use strict'

const express = require('express');
const router = express.Router()
const  productControllers = require('../../controllers/controllers.product')
const asynHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');


////////////////////////////////////////
// AUTHENTICATION
router.use(authenticationV2);
////////////////////////////////////////

router.post('', asynHandler(productControllers.createProduct));


module.exports = router;

