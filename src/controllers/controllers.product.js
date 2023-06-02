
'use strict'
const productService = require('../services/products.service');
const productServiceV2 = require('../services/products.service.xxxx');

const { SuccessResponse } = require('../core/success.response')

class ProductControllers {

    createProduct = async (req, res, next) => {
        const type  = req.body.product_type;
        const payload = req.body;
        const userID = req.user.userID;

        // new SuccessResponse ( {
        //     message: "create new product success!",
        //     metadata : await productService.createProduct(type,{
        //         ...payload,
        //         product_shop: userID
        //     }),
        // }).send(res)

        new SuccessResponse({
            message: "create new product success!",
            metadata: await productServiceV2.createProduct(type, {
                ...payload,
                product_shop: userID
            }),
        }).send(res)

    }

}

module.exports = new ProductControllers();

