
const { check } = require('express-validator')

const ValiditorMiddlware = require('../../Middlwares/ValiditorMiddlware') ;

const OrderModule = require('../../module/OrderModule')

const handleRequiset = ( req , res , next  ) => {

    req.body = {
        city : req.body.city ,
        alias : req.body.alias,
        details : req.body.details,
        phone : req.body.phone,
        code_postal : req.body.code_postal,
    }

    next();
}

const handleUpdaterequiste = ( req , res , next ) => {
    req.body = {
        taxPrice : req.body.taxPrice,
        schoppingPrice : req.body.schoppingPrice ,
    }
    next()
}

exports.CreateOrderValidator = [
    handleRequiset,
    check('phone')
    .optional()
    .isMobilePhone(['ar-MA'])
    .withMessage('not valid form for phone') ,


    check('code_postal')
    .optional()
    .isPostalCode('any')
    .withMessage('not valid form for code postal'),
    ValiditorMiddlware
]

exports.UpdateStatusOfTaxAndShopeOrderValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('not valid id'),

    handleUpdaterequiste,
    check('taxPrice')
    .optional()
    .isFloat()
    .withMessage('not valid form for tax price')
    .custom(async (value , {req}) => {
        console.log(req.params.id)
        const order = await OrderModule.findOne({_id : req.params.id});
        console.log(order)
        if(!order) throw new Error('order not found');
        const saveTax = order.taxPrice;
        order.totaleOrderPrice = order.totaleOrderPrice - saveTax + value ;
        req.body.taxPrice = value ;
        await order.save();
        return true ;
    }) ,

    check('schoppingPrice')
    .optional()
    .isFloat()
    .withMessage('not valid form for shopping price')
    .custom(async (value , {req}) => {
        const order = await OrderModule.findOne({_id : req.params.id});
        if(!order) throw new Error('order not found');
        const saveShop = order.schoppingPrice;
        order.totaleOrderPrice = order.totaleOrderPrice - saveShop + value ;
        req.body.schoppingPrice = value;
        await order.save();
        return true ;
    }),

    ValiditorMiddlware
]


exports.UpdateStatusOfPaidOrderValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('not valid id'),
    ValiditorMiddlware
]
exports.UpdateStatusOfDelevireOrderValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('not valid id'),
    ValiditorMiddlware
]