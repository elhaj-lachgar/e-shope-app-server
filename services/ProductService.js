/* eslint-disable camelcase */


const {
  DeleteServiceHandler,
  UpdateServiceHandler,
  GetByIdServiceHandler,
  CreateServiceHandler,
  GetServiceHandler,
} = require("./FacteryHandler");


const ProductModule = require("../module/ProductsModule");


// post methode
// url api/v1/products
// create new product

exports.CreateProductService = CreateServiceHandler(ProductModule, "product");

// get methode
// get one product
// url api/v1/product
exports.GetProductService = GetServiceHandler(ProductModule, "product");

// get methode
// get all product
// url api/v1/product/:id
exports.GetProductByIdService = GetByIdServiceHandler(ProductModule ,"reviews");

// put methode
// update products
// url api/v1:product/:id
exports.UpdateProductService = UpdateServiceHandler(ProductModule, "product");

// delete methode
// delete products
// url api/v1:product/:id
exports.DeleteProductService = DeleteServiceHandler(ProductModule);
