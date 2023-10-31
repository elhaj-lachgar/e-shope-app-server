const express = require("express");

const {
  CreateCouponService,
  DeleteCouponService,
  GetCouponByIdService,
  GetCouponService,
  UpdateCouponService,
} = require("../services/CouponService");

const { AuthService, allwodTo } = require("../services/AuthService");

const {
  CreateCouponValidator,
  GetByIdCouponValidator,
  UpdateCouponValidator,
  DeleteCouponValidator,
} = require("../utils/Validitor/CouponValidator");


const router = express.Router();

router.get("/", AuthService, allwodTo("manager", "admin"), GetCouponService);

router.get(
  "/:id",
  AuthService,
  allwodTo("manager", "admin"),
  GetByIdCouponValidator,
  GetCouponByIdService
);

router.post(
  "/",
  AuthService,
  allwodTo("manager", "admin"),
  CreateCouponValidator,
  CreateCouponService
);

router.put(
  "/:id",
  AuthService,
  allwodTo("manager", "admin"),
  UpdateCouponValidator,
  UpdateCouponService
);

router.delete(
  "/:id",
  AuthService,
  allwodTo("manager", "admin"),
  DeleteCouponValidator,
  DeleteCouponService
);


module.exports = router;