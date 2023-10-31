const express = require("express");

const router = express.Router();
const {
  GetCategoreByIdValidator,
  CreateCategoreValidator,
  NestRouteValiditor,
  DeleteCategoreValidator,
  UpdateCategoreValidator,
} = require("../utils/Validitor/CategoreValiditor");
const {
  AdditionMiddlwareOfNestedRoute,
} = require("../Middlwares/AdditionMiddlware");
const {
  CreateCategore,
  GetCategores,
  GetElementById,
  UpdateCategore,
  DeleteCategore,
} = require("../services/CategoreService");

const { AuthService, allwodTo } = require("../services/AuthService");

const { UplaodOneImageHandler } = require("../Middlwares/HandlerUploadImage");

const SubcategoreRoute = require("./SubCategoreRoute");
// nested route of subcategores
router.use(
  "/:CategoreId/subcategore",
  NestRouteValiditor,
  AdditionMiddlwareOfNestedRoute,
  SubcategoreRoute
);

// ,CreateCategoreValidator,CreateCategore

// route of categores
router.post(
  "/",
  AuthService,
  allwodTo("admin", "manager"),
  UplaodOneImageHandler,
  CreateCategoreValidator,
  CreateCategore
);

router.get("/", GetCategores);
router.get(
  "/:id",
  GetCategoreByIdValidator,
  GetElementById
);
router.put(
  "/:id",
  AuthService,
  UplaodOneImageHandler,
  UpdateCategoreValidator,
  UpdateCategore
);
router.delete(
  "/:id",
  allwodTo("admin"),
  AuthService,
  DeleteCategoreValidator,
  DeleteCategore
);

module.exports = router;
