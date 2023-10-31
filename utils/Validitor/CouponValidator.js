const { check } = require ('express-validator')

const ValiditorMiddlware = require('../../Middlwares/ValiditorMiddlware') ;

const CouponModule = require ('../../module/CouponModule')


const handlerequist = ( req , res , next ) => {
    req.body = {
        expired : req.body.expired ,
        discount : req.body.discount
    }
    next()
} 

exports.CreateCouponValidator =  [
    check('discount')
    .notEmpty()
    .withMessage('discount is required')
    .isFloat()
    .withMessage('not valid form for discount'),


    check('exipred')
    .notEmpty()
    .withMessage('expired is required')
    .custom((value , { req }) => {
        const regxdate = new RegExp(/(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0,1,2])\-(18|19|20)\d{2}/)

        const Isvalid  = regxdate.test(value);
    
        if (!Isvalid) throw new Error ('date not valid form')

        const date = new Date( value );

        req.body.expired = date ;
        return true ;

    }),


    check('name')
    .notEmpty()
    .withMessage('name is required')
    .toUpperCase()
    .custom(async( value) => {
        const coupon = await CouponModule.findOne({name : value});
        if(coupon) throw new Error ('this name already exsict')
        return true ;
    }),

    ValiditorMiddlware,
    
]


exports.UpdateCouponValidator = [
    
    check('id')
    .notEmpty()
    .withMessage(' id is required')
    .isMongoId()
    .withMessage(' id is invalid '),


    check('discount')
    .optional()
    .isFloat()
    .withMessage('not valid form for discount'),


    check('exipred')
    .optional()
    .trim()
    .isDate()
    .withMessage('not valid form for expired'),

    ValiditorMiddlware,
    handlerequist,
]

exports.DeleteCouponValidator = [
    
    check('id')
    .notEmpty()
    .withMessage(' id is required')
    .isMongoId()
    .withMessage(' id is invalid '), 

    ValiditorMiddlware,
]

exports.GetByIdCouponValidator = [
    
    check('id')
    .notEmpty()
    .withMessage(' id is required')
    .isMongoId()
    .withMessage(' id is invalid '), 
    
    ValiditorMiddlware,
]