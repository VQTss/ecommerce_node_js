
'use strict'
const productService = require('../services/products.service');
const { SuccessResponse} = require('../core/success.response')

class ProductControllers {

    createProduct = async(req, res, next) => {
        const type  = req.body.product_type;
        const payload = req.body;
        new SuccessResponse ( {
            message: "create product success!",
            metadata : await productService.createProduct(type,{
                ...req.body,
                product_shop: req.user.userID
            }),
        }).send(res)
    }
   
}

module.exports = new ProductControllers();

