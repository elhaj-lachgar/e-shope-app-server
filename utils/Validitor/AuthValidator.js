const { check } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const bycrypt = require("bcryptjs");

const UserModule = require("../../module/UserModule");

exports.SingUpValidator = [
  // name

  check("name")
    .notEmpty()
    .withMessage("name is missing")
    .isLength({ min: 4 })
    .withMessage("name is to short ")
    .isLength({ max: 32 })
    .withMessage("name is to long "),

  // email

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("not valid format of email")
    .custom ( async ( value ) => {
      const user = await UserModule.findOne({email : value });
      
      if (user){
        throw new Error ('this email already used : ' + value );
      }
      return true ;
    }),

  // password

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password is to short"),


  ValiditorMiddlware,
];


exports.SingInValidator = [

    // email

    check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("not valid format of email"),

  // password

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password is to short"),

    ValiditorMiddlware ,

]


exports.ForgotPasswordValidator = [
  check('email' )
  .notEmpty()
  .withMessage('email is required')
  .isEmail()
  .withMessage('email is not valid '),
  ValiditorMiddlware ,
]

exports.VerfieRestCodeValidator = [
  check('restCode')
  .notEmpty()
  .withMessage('rest code is required')
  .isNumeric()
  .withMessage('not valid form for rest code')
  .isLength({min : 6})
  .withMessage('not valid rest code ')
  .isLength({ max  : 6})
  .withMessage('not valid rest code'),

  ValiditorMiddlware,
]

exports.RestPasswordValidator = [
  check('email' )
  .notEmpty()
  .withMessage('email is required')
  .isEmail()
  .withMessage('email is not valid '),

  check('confirmpassword')
  .notEmpty()
  .withMessage('confirm pssword is required')
  .isLength({min : 8})
  .withMessage('confirm password to short'),

  check('newpassword')
  .notEmpty()
  .withMessage('confirm pssword is required')
  .isLength({min : 8})
  .withMessage('confirm password to short')
  .custom ( ( value , { req }) => {
    const Isvalid = value === req.body.confirmpassword ;
     if (! Isvalid ) throw new Error('confirm password is incorrect');
     delete req.body.confirmpassword;
     return true ; 
  }),
  ValiditorMiddlware
]