const { check } = require("express-validator");

const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const bycrypt = require("bcryptjs");

const asynchandler = require('express-async-handler')

const UserModule = require("../../module/UserModule");
const ApiFeatures = require("../ApiFeatures");
const ErrorHandling = require("../ErrorHandling");

exports.CreateUserValidator = [
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
    .withMessage("not valid format of email"),
  // confirme password

  check("passwordConfirme")
    .notEmpty()
    .withMessage(" password confirme is required "),
  // password

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password is to short")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirme) {
        throw new Error(" password confirme is incorrect");
      }
      delete req.body.passwordConfirme;
      return true;
    }),

  // phone
  check("phone")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("phone number is not valid "),

  // role
  check("role")
    .optional()
    .custom((value) => {
      const roles = ["user", "admin"];
      const values = roles.map((ele) => {
        return value === ele ? value : null;
      });
      if (!values) {
        throw new Error(`this role not include in DB : ${value}`);
      }
      return true;
    }),

  ValiditorMiddlware,
];

exports.GetUserByIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is missing")
    .isMongoId()
    .withMessage("id not valid"),
  ValiditorMiddlware,
];

exports.UpdateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("missing User id ")
    .isMongoId()
    .withMessage("not valid id sub"),

    check("name")
    .optional()
    .isLength({ min: 4 })
    .withMessage("name is to short ")
    .isLength({ max: 32 })
    .withMessage("name is to long "),

  // email

  check("email")
    .optional()
    .isEmail()
    .withMessage("not valid format of email"),
  
  check("password")
    .optional()
    .custom((value, { req }) => {
      if (value) delete req.body.password;
      return true;
    }),
    
  // phone
    check("phone")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("phone number is not valid "),

  // role
  check("role")
    .optional()
    .custom((value) => {
      const roles = ["user", "admin"];
      const values = roles.map((ele) => {
        return value === ele ? value : null;
      });
      if (!values) {
        throw new Error(`this role not include in DB : ${value}`);
      }
      return true;
    }),
  ValiditorMiddlware,
];

exports.DeleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("this id not valid one"),
  ValiditorMiddlware,


];

exports.ChangePasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("id not valid")
    .isMongoId()
    .withMessage("this id not valid one")
    .custom(async (value) => {
      const user = await UserModule.findById(value);
      if (!user) {
        throw new Error("this user not existe in db ");
      }
      return true;
    }),

  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required ")
    .isLength({ min: 8 })
    .withMessage("currnet password is to short"),

  check("ConfiremNewPassord")
    .notEmpty()
    .withMessage("confirm new password is required ")
    .isLength({ min: 8 })
    .withMessage("confirm new password is to short"),

  check("newPassord")
    .notEmpty()
    .withMessage("new password is required ")
    .isLength({ min: 8 })
    .withMessage("new password is to short")
    .custom((value, { req }) => {
      const { ConfiremNewPassord } = req.body;
      const valid = ConfiremNewPassord === value;
      if (!valid) throw new Error("confirm password incorrected ");
      return true;
    })
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const { currentPassword } = req.body;

      const user = await UserModule.findById(id);

      const valid = bycrypt.compareSync(currentPassword, user.password);
      if (!valid) throw new Error("current passeword incorrect ");
      req.body.password = value;
      delete req.body.currentPassword;
      delete req.body.newPassword;
      delete req.body.ConfiremNewPassord;
      return true;
    }),
  ValiditorMiddlware,
];

exports.UpdateLoggedUserValidator = [
  check("name")
  .optional()
  .isLength({ min: 4 })
  .withMessage("name is to short ")
  .isLength({ max: 32 })
  .withMessage("name is to long "),

// email

check("email")
  .optional()
  .isEmail()
  .withMessage("not valid format of email"),


// phone
  check("phone")
  .optional()
  .isMobilePhone("ar-MA")
  .withMessage("phone number is not valid "),
  ValiditorMiddlware
]



exports.ActiveAccountOfUserLoggedValidator = [

  check("email")
  .notEmpty()
  .withMessage('email required')
  .isEmail()
  .withMessage("not valid format of email"),

  check("password")
  .notEmpty()
  .withMessage("password is required")
  .isLength({ min: 8 })
  .withMessage("password is to short")
  .custom(({req} ) => {
    if (req.user.active) throw new Error (' this user already active');
    return true ;
  }),

  ValiditorMiddlware ,
]




exports.DesactiveAccountOfUserLoggedValidator = asynchandler ( async ( req , res , next ) => {
  if ( ! req.user.active ) return next( new ErrorHandling ('this already desactive' , 401 )) ;
  next()
})

