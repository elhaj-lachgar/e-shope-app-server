
const { check }  =require("express-validator")
const ValiditorMiddlware = require('../../Middlwares/ValiditorMiddlware')
const CategoreModule = require('../../module/CategoreModule')


exports.GetCategoreByIdValidator = [ 
    check("id").isMongoId().withMessage('id not valid'),
    ValiditorMiddlware,
]

exports.CreateCategoreValidator = [
    check("name").notEmpty().withMessage('name is missing !!!')
    .isLength({min : 3 }).withMessage('name is to short ')
    .isLength({max :32 }).withMessage('name is to long ')
    .custom ( async (value) => {
        const filerObj = { name : value };
        const categore =  await CategoreModule.find(filerObj);
        
        if ( categore.length != 0 ) {
            console.log(categore)
            throw new Error (`this name has beeing selected ${value}`)
        };
        return true ;
    }),
    ValiditorMiddlware,
]

exports.DeleteCategoreValidator = [
    check("id").isMongoId().withMessage("id not valid"),
    ValiditorMiddlware
]

exports.UpdateCategoreValidator = [
    check('id').isMongoId().withMessage("id not valid"),
    ValiditorMiddlware,
]

exports.NestRouteValiditor = [
    check('CategoreId').isMongoId().withMessage('id of categore is not valid  '),
    ValiditorMiddlware
]