const express = require("express");

const router = express.Router();
const { UploadGroupeOfImage } = require("../Middlwares/HandlerUploadImage");
const { AdditionMiddlwareOfNestedRoute } = require('../Middlwares/AdditionMiddlware')
const {
  CreateProductService,
  DeleteProductService,
  GetProductByIdService,
  GetProductService,
  UpdateProductService,
} = require("../services/ProductService");

const {
  CreateProductValidator,
  DeleteProductValidator,
  GetProductByIdValidator,
  UpdateProductValidator,
  NestedRouteOfProductValidator
} = require("../utils/Validitor/ProductValidator");

const { AuthService, allwodTo } = require("../services/AuthService");

const {
  AdditionMiddlwareOfHandleTitleSlugfiy,
} = require("../Middlwares/AdditionMiddlware");

const reviewRoute = require('./ReviewRoute')




// nested route of get spicifique review 


router.use ('/:productId/review' , NestedRouteOfProductValidator , reviewRoute)

// GET
router.get("/", GetProductService);
router.get("/:id", GetProductByIdValidator, GetProductByIdService);

// post

router.post(
  "/",
  AuthService,
  allwodTo("admin", "manager"),
  UploadGroupeOfImage,
  CreateProductValidator,
  CreateProductService
);

// put

router.put(
  "/:id",
  AuthService,
  allwodTo("admin", "manager"),
  UploadGroupeOfImage,
  UpdateProductValidator,
  AdditionMiddlwareOfHandleTitleSlugfiy,
  UpdateProductService
);

// delete

router.delete(
  "/:id",
  AuthService,
  allwodTo("admin"),
  DeleteProductService,
  DeleteProductValidator
);

module.exports = router;
