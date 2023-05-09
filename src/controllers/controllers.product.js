
'use strict'
const productService = require('../services/products.service');
const { SuccessResponse} = require('../core/success.response')

class ProductControllers {

    createProduct = async(req, res, next) => {
        const type  = req.body.product_type;
        const payload = req.body;
        console.log(`type:::`,type);
        console.log(`payload:::`,payload);
        new SuccessResponse ( {
            message: "create product success!",
            metadata : await productService.createProduct(type,payload),
        }).send(res)
    }
   
}

module.exports = new ProductControllers();

