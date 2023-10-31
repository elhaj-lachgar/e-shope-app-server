const { check } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");


const ProductModule = require('../../module/ProductsModule')

exports.AddProductToWishListValidator =  [
    check('productId')
    .notEmpty()
    .withMessage(' product id is required ')
    .isMongoId()
    .withMessage(' product id not valid ')
    .custom ( async ( value ) => {
        const product = await ProductModule.findById(value);
        if ( ! product ) throw new Error ('this product not found');
        return true;
    }),
    ValiditorMiddlware
]

exports.RemoveProductFromWishListValidator = [
    check('id')
    .notEmpty()
    .withMessage(' product id is required ')
    .isMongoId()
    .withMessage(' product id not valid ')
    .custom ( async ( value ) => {
        const product = await ProductModule.findById(value);
        if ( ! product ) throw new Error ('this product not found');
        return true;
    }),
    ValiditorMiddlware
]