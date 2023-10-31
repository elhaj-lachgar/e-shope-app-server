const { check } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");


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


exports.AddAdresseValidator = [
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

exports.RemoveAddresseValidator = [
    check('id')
    .notEmpty()
    .withMessage(' id is required valid ')
    .isMongoId()
    .withMessage('not valid form of id '),
    ValiditorMiddlware
]