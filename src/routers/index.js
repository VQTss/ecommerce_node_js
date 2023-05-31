'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router()
const userRouter = require('./access');
const productRouter = require('./product');

router.use(apiKey);
router.use(permission('0000'))

router.use('/v1/api',userRouter);

router.use('/v1/api/product',productRouter);

module.exports = router;

