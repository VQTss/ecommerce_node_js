
const {product, electronic, clothing} =  require('../models/product.model');
const {BadRequestError} = require('../core/error.response');


class ProductFactory {
    static async createProduct (type,payload) {
        switch (type) {
            case 'Eletronic':
                return new Electronics(payload).createProduct();                
            case 'Clothing' :
                return new Clothing(payload).createProduct();                
            default:
                throw new BadRequestError("Invalid product types ",type);
        }
    }
}

/**
  product_name : {
        type: String,
        required: true,
    },
    product_thumb : {
        type: String,
        required: true,
    },
    product_description : {
        type : String
    },
    product_price : {
        type: Number,
        required : true,
    },
    product_quantity : {
        type: Number,
        required : true,
    },
    product_type : {
        type: String,
        required : true,
        enum : ['Electronics', 'Clothing', 'Furniture'],

    },
    product_shop : {
        type: Schema.Types.ObjectId , 
        ref: "Shop"
    },
    product_attribute : {
        type : Schema.Types.Mixed , 
        required  : true
    }



 */

class Product { 
    constructor({product_name,product_thumb,product_description,product_price,product_quantity,product_type,product_shop,product_attribute}) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attribute = product_attribute;
    }

    async createProduct() {
        return await product.create(this);
    }
}

class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create(this.product_attribute);
        if (!newElectronic) {
            throw new BadRequestError("create new Electronics error");
        }
        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Create new product error");
        }
        return newProduct;
    }
}

class Clothing extends Product{
    async createProduct(){
        const newElectronic = await clothing.create(this.product_attribute);
        if (!newElectronic) {
            throw new BadRequestError("create new Electronics error");
        }
        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Create new product error");
        }
        return newProduct;
    }
}


module.exports = ProductFactory;
