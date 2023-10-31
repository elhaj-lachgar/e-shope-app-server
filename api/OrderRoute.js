const express = require("express");

const {
  CreateOrderService,
  GetAllOrderService,
  GetOrderOfLoggedUser,
  UpdateStatusOfDelaiverProductService,
  UpdateStatusOfPaidProductService,
  UpdateStatusOfTaxAndShopeProductService,
  CreatePayementSession,
} = require("../services/OrderService");

const { AuthService, allwodTo } = require("../services/AuthService");

const {
  CreateOrderValidator,
  UpdateStatusOfDelevireOrderValidator,
  UpdateStatusOfPaidOrderValidator,
  UpdateStatusOfTaxAndShopeOrderValidator,
} = require("../utils/Validitor/OrderValidator");

const router = express.Router();

router.get(
  "/checkout-session/:cardId",
  AuthService,
  allwodTo("user"),
  CreatePayementSession
);

router.post(
  "/",
  AuthService,
  allwodTo("user"),
  CreateOrderValidator,
  CreateOrderService
);

router.get(
  "/allorders",
  AuthService,
  allwodTo("admin", "manager"),
  GetAllOrderService
);

router.get(
  "/",
  AuthService,
  allwodTo("user", "admin", "manager"),
  GetOrderOfLoggedUser
);

router.put(
  "/taxAndshope/:id",
  AuthService,
  allwodTo("admin", "manager"),
  UpdateStatusOfTaxAndShopeOrderValidator,
  UpdateStatusOfTaxAndShopeProductService
);

router.put(
  "/delever/:id",
  AuthService,
  allwodTo("admin", "manager"),
  UpdateStatusOfDelevireOrderValidator,
  UpdateStatusOfDelaiverProductService
);
router.put(
  "/paid/:id",
  AuthService,
  allwodTo("admin", "manager"),
  UpdateStatusOfPaidOrderValidator,
  UpdateStatusOfPaidProductService
);

module.exports = router;
