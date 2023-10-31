const { check } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const BrundModule = require('../../module/BrundModule')

exports.CreateBrundValidator = [
    check("name").notEmpty().withMessage("Brund required I name")
    .isLength({ min : 3}).withMessage('name Brund is to short')
    .isLength({ max  : 32}).withMessage('name of brund is to long ')
    .custom ( async (value) => {
        console.log(value)
        const filerObj = { name : value };
        const categore =  await BrundModule.find(filerObj);
        if ( categore.length != 0 ) throw new Error (`this name has beeing selected ${value}`);
        return true ;
    }),
    ValiditorMiddlware
]


exports.UpdateBrundValidator = [
    check('id').notEmpty().withMessage('this operation need id '),
    check("name").optional()
    .isLength({ min : 3}).withMessage('name Brund is to short')
    .isLength({ max  : 32}).withMessage('name of brund is to long '),
    ValiditorMiddlware
]

exports.DeleteBrundValidator = [
    check('id').isMongoId().withMessage('id of brund unvalid'),
    ValiditorMiddlware
] 



exports.GetBrundByIdValidator = [
    check('id').isMongoId().withMessage('id of brund unvalid'),
    ValiditorMiddlware
] 