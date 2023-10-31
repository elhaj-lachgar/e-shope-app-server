const express = require("express");

const {
  AddToCardService,
  GetCardOfLoggedUser,
  DeleteProductFromCardOfUserLogged,
  ClearCardOfUserLogged,
  UpdateQuantityOfProduct,
  ActivateCouponService,
} = require("../services/CardService");

const { AuthService, allwodTo } = require("../services/AuthService");

const {
  AddToCardValidator,
  DeleteProductFromCardValidator,
  ActiveCouponValidator,
  UpdateCardQuantityValidator,
} = require("../utils/Validitor/CardValidtor");

const router = express.Router();

router.post(
  "/",
  AuthService,
  allwodTo("user"),
  AddToCardValidator,
  AddToCardService
);

router.get("/", AuthService, allwodTo("user"), GetCardOfLoggedUser);

router.delete(
  "/",
  AuthService,
  allwodTo("user"),
  DeleteProductFromCardValidator,
  DeleteProductFromCardOfUserLogged
);

router.delete("/clear", AuthService, allwodTo("user"), ClearCardOfUserLogged);

router.put(
  "/",
  AuthService,
  allwodTo("user"),
  UpdateCardQuantityValidator,
  UpdateQuantityOfProduct
);

router.put(
  "/coupon",
  AuthService,
  allwodTo("user"),
  ActiveCouponValidator,
  ActivateCouponService
);
module.exports = router;
