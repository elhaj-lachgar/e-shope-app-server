const { check , body } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const ReviewModule = require ('../../module/ReviewModule');

const ProductModule = require('../../module/ProductsModule') ;

exports.CreateReviewValidator = [ 

    check ('product')
    .notEmpty()
    .withMessage('product id is required')
    .isMongoId()
    .withMessage('id not valid')
    .custom( async (value , { req }) => {
        const product = await ProductModule.findById(value);
        if (! product ) throw new Error ('this product not found');
        const review  = await ReviewModule.findOne({user : req.user._id , product : value });
        if ( review ) throw new Error ('this user had already create review');
        return true ;
    }),

    check('rating')
    .notEmpty()
    .withMessage('rating is required')
    .isFloat({min : 1 , max : 5}).withMessage('rating has to be beteewn 1 and 5 '),
    ValiditorMiddlware ,
]

exports.UpdateReviewValidator = [

    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id invalid')
    .custom ( async ( value , { req }) => {
        const review = await ReviewModule.findById(value);
        if ( ! review ) throw new Error ('review isnot found ') ;
        if ( req.user._id.toString() !== review.user._id.toString() ) throw new Error ('you dont have access to this review');
        req.body = {
            rating : req.body.rating ,
            content : req.body.content ,
        }
        return true ;
    }),

    ValiditorMiddlware ,

]



exports.GetByIdReviewValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required ')
    .isMongoId()
    .withMessage('id invalid'),
    ValiditorMiddlware ,
]

exports.DeleteReviewValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required ')
    .isMongoId()
    .withMessage('id invalid')
    .custom ( async ( value , { req }) => {
        const review = await ReviewModule.findById(value);
        if(!review) throw new Error ('review not found');
        if ( ['admin' , 'manager'].includes(req.user.role)) return true ;
        if ( req.user._id.toString() !== review.user._id.toString() ) throw new Error ('you dont have access to this review');
        return true ;
    }),
    ValiditorMiddlware,
]


