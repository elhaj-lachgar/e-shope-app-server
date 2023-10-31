const { check } = require("express-validator");
const CategoreModule  = require("../../module/CategoreModule") 
const SubCategoreModule = require('../../module/SubCategoreModule')
const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

exports.CreateSubCategoreValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is missing")
    .isLength({ min: 2 })
    .withMessage("name is to short ")
    .isLength({ max: 32 })
    .withMessage("name is to long ")
    .custom ( async (value) => {
      const filerObj = { name : value };
      const categore =  await SubCategoreModule.find(filerObj);
      if ( categore.length != 0 ) throw new Error (`this name has beeing selected ${value}`);
      return true ;
  }),
  check("categore")
    .isMongoId()
    .withMessage("id of categore not valid ")
    .custom ( async (value) => {
      const categore = await CategoreModule.findById(value);
      if(!categore){
        throw new Error ('categore not found')
      }
      return true ;
    }),
  ValiditorMiddlware,
];

exports.GetSubCategoreByIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is missing")
    .isMongoId()
    .withMessage("id not valid"),
  ValiditorMiddlware,
];

exports.UpdateSubCategoreValidator = [
  check("id")
    .notEmpty()
    .withMessage("missing subcategore id ")
    .isMongoId()
    .withMessage("not valid id sub"),
  ValiditorMiddlware,
];

exports.DeleteSubcategoreValidator = [
  check('id').isMongoId().withMessage('this id not valid one')
]