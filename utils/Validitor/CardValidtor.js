
const { check } = require('express-validator') ;

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const ProductModule = require('../../module/ProductsModule')


exports.AddToCardValidator = [
    check('productId')
    .notEmpty()
    .withMessage('product id required')
    .isMongoId()
    .withMessage(' product id not valid ')
    .custom( async ( value , { req } ) => {
        const product = await ProductModule.findOne({_id : value});
        if ( ! product ) throw new Error(' this product is not found ');
        req.body.Product = product ;
        return true ;
    }),

    check('quantity')
    .notEmpty()
    .withMessage('quantity is required ')
    .isNumeric()
    .withMessage(' not valid form for quantity (number)') ,


    check('color')
    .notEmpty()
    .withMessage(' color is required ')
    .toLowerCase() ,
    ValiditorMiddlware
]


exports.DeleteProductFromCardValidator = [
    // , 
    check("productId")
    .notEmpty()
    .withMessage('product id is required')
    .isMongoId()
    .withMessage('id not valid')
    .custom( async ( value , { req } ) => {
        const product = await ProductModule.findOne({_id : value});
        if ( ! product ) throw new Error(' this product is not found ');
        req.body.Product = product ;
        return true ;
    }),


    ValiditorMiddlware,
]


exports.UpdateCardQuantityValidator = [
    check('quantity')
    .notEmpty()
    .withMessage(' quantity is required ')
    .isFloat({min : 1 })
    .withMessage(' qunatity is not valid '),


    
    check("productId")
    .notEmpty()
    .withMessage('product id is required')
    .isMongoId()
    .withMessage('id not valid')
    .custom( async ( value , { req } ) => {
        const product = await ProductModule.findOne({_id : value});
        if ( ! product ) throw new Error(' this product is not found ');
        req.body.Product = product ;
        return true ;
    }),


    ValiditorMiddlware,
]


exports.ActiveCouponValidator = [
    check('coupon')
    .notEmpty()
    .withMessage('coupon is required')
    .toUpperCase() , 
    ValiditorMiddlware,
]