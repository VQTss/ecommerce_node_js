'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router()

const userRouter = require('./access');

router.use(apiKey);
router.use(permission('0000'))

router.use('/v1/api',userRouter);


module.exports = router;

