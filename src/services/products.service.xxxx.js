const  {product , clothing , electronic , furniture} =  require('../models/product.model');
const {BadRequestError} = require('../core/error.response');
// define Factory class to create product

class ProductFactory {

    static productRegistry = {}; // key - class
    static registerProductType (type , classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
       const producClass = ProductFactory.productRegistry[type];
       if (!producClass) {
        throw new BadRequestError(`Invalid product type ${type}`); 
       }
       return new producClass(payload).createProduct();
    }
}

// define base product class

class Product {
    constructor({product_name, product_thumb, product_description,product_price, product_quantity, 
        product_type, product_shop, product_attribute}) {
            this.product_name = product_name;
            this.product_thumb = product_thumb;
            this.product_description = product_description;
            this.product_price = product_price;
            this.product_quantity = product_quantity;
            this.product_type = product_type;
            this.product_shop = product_shop;
            this.product_attribute = product_attribute;
    }
    // create new product
    async createProduct (product_id) {
        return await product.create({...this, _id : product_id});
    }
}
// define sub-class for different product types clothing
class Clothing extends  Product{
    async createProduct (){
        const newClothing = await clothing.create({
            ...this.product_attribute,
            product_shop:  this.product_shop
        });
        if (!newClothing) {
            throw new BadRequestError('create new Clothing error');
        }
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct){
            throw new BadRequestError('create new Product error');
        }
        return newProduct;
    }
}

class Electronic extends  Product{

     async createProduct (){
        const newElectronic = await electronic.create({
            ...this.product_attribute,
            product_shop:  this.product_shop
        });
      
        if (!newElectronic) {
            throw new BadRequestError('create new Electronic error');
        }
        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct){
            throw new BadRequestError('create new Product error');
        }
        return newProduct;
    }
}


class Funiture extends  Product{

    async createProduct (){
       const newFuniture = await furniture.create({
           ...this.product_attribute,
           product_shop:  this.product_shop
       });
     
       if (!newFuniture) {
           throw new BadRequestError('create new Electronic error');
       }
       const newProduct = await super.createProduct(newFuniture._id);
       if(!newProduct){
           throw new BadRequestError('create new Product error');
       }
       return newProduct;
   }
}

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Funiture', Funiture);



module.exports = ProductFactory;

