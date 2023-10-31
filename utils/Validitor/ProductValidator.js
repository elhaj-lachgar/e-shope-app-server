/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
const mongoose = require("mongoose");
const { check } = require("express-validator");
const ValiditorMiddlware = require("../../Middlwares/ValiditorMiddlware");

const ModuleCategore = require("../../module/CategoreModule");

const ModuleSubcategore = require("../../module/SubCategoreModule");

const BrundModule = require("../../module/BrundModule");
const ProductModule = require("../../module/ProductsModule");

exports.CreateProductValidator = [
  // required

  // title Validation
  check("title")
    .notEmpty()
    .withMessage("title of product is required")
    .isLength({ min: 3 })
    .withMessage("title of product is to short")
    .isLength({ max: 100 })
    .withMessage("title of product is to long"),

  // description Validation

  check("description")
    .notEmpty()
    .withMessage("description of product is required")
    .isLength({ min: 3 })
    .withMessage("title of descprition is to short"),

  // image_cover Validation
  check("image_cover")
    .notEmpty()
    .withMessage("image cover is required for product")
    .isString()
    .withMessage("not valid for for image"),

  //Validation of categore = [ id of categore ]
  check("categore")
    .notEmpty()
    .withMessage("categore is required for product")
    .isMongoId()
    .withMessage("categore id not valid")
    .withMessage("categore not valid")
    .custom(async (value) => {
      const categore = await ModuleCategore.findById(value);
      if (!categore) throw new Error(`categore id ${value} not existe `);
      return true;
    }),

  // Validation Count_rate
  check("count_rate")
    .optional()
    // .withMessage(" count rate is required for product")
    .isNumeric()
    .withMessage("count_rate shold bee number"),

  // Validation Quantity
  check("quantity")
    .notEmpty()
    .withMessage(" count rate is required for product")
    .isNumeric()
    .withMessage("quantity  shold bee number"),

  // Validation price
  check("price")
    .notEmpty()
    .withMessage(" price rate is required for product")
    .isNumeric()
    .withMessage("price  shold bee number"),

  // optional

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors of product  must an array"),

  check("sold").optional().isNumeric().withMessage("sold must be number"),

  check("discount_price")
    .optional()
    .isNumeric()
    .withMessage("discount price of product must be number")
    .custom((value, { req }) => {
      if (req.body.price > value) {
        return true;
      }
      throw new Error("price must bee great than discount price");
    }),
  check("avg_rating")
    .optional()
    .isFloat()
    .withMessage("avg rating must bee float ")
    .isLength({ min: 1 })
    .withMessage("rate must bee greate than 1")
    .isLength({ max: 5 })
    .withMessage("rate must bee lower than 5"),
  check("brund")
    .optional()
    .isMongoId()
    .withMessage("brund id not valid for product")
    .custom(async (value) => {
      const Brund = await BrundModule.findById(value);
      if (!Brund) throw Error(`Brund id : ${value} not found`);
      return true;
    }),
  check("subcategore")
    .optional()
    .isArray()
    .withMessage("subcategore is arry")
    .isMongoId()
    .withMessage("subcategore id not valid for product")
    .custom(async (value) => {
      const subcategores = await ModuleSubcategore.find({
        _id: { $exists: true, $in: value },
      });

      if (value.length !== subcategores.length) {
        throw new Error("subcategores not found");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const subcategores = await ModuleSubcategore.find({
        _id: { $exists: true, $in: value },
      });
      let validator = value.length;
      subcategores.map((ele) => {
        console.log("ele", ele.categore, "req");
        if (ele.categore.toString() !== req.body.categore) {
          validator -= 1;
        }
      });

      if (validator !== value.length) {
        throw new Error(`subcategore not blew to the categore`);
      }

      return true;
    }),
  check("image")
    .optional()
    .isArray()
    .withMessage("iamge must be arry for product"),
  ValiditorMiddlware,
];

exports.DeleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("id of Product unvalid"),
  ValiditorMiddlware,
];

exports.GetProductByIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("id of Product unvalid"),
  ValiditorMiddlware,
];

exports.UpdateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("id not valid product"),
  ValiditorMiddlware,
];

exports.NestedRouteOfProductValidator = [
  check("productId")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("id not valid product")
    .custom (async (value ,{req}) => {
        console.log('hi');
        const product = await ProductModule.findById(value);
        if(!product) throw new Error('product is not found');
        const {productId} = req.params ; 
        req.body.product = productId;
        req.query.product = productId ;
        return true ;
    })
    ,
];
