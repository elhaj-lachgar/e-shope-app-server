const express = require("express");

const router = express.Router();
const { UplaodOneImageHandler } = require("../Middlwares/HandlerUploadImage");
const {
  CreateBrundServices,
  DeleteBrundServices,
  GetBrundByIdServices,
  GetBrundService,
  UpdateBrundServices,
} = require("../services/BrundService");

const {
  CreateBrundValidator,
  DeleteBrundValidator,
  UpdateBrundValidator,
  GetBrundByIdValidator,
} = require("../utils/Validitor/BrundValidator");

const { AuthService, allwodTo } = require("../services/AuthService");

// GET
router.get("/", GetBrundService);
router.get("/:id", GetBrundByIdValidator, GetBrundByIdServices);

// post

router.post(
  "/",
  AuthService,
  allwodTo("admin", "manager"),
  UplaodOneImageHandler,
  CreateBrundValidator,
  CreateBrundServices
);

// put

router.put(
  "/:id",
  AuthService,
  allwodTo("admin", "manager"),
  UplaodOneImageHandler,
  UpdateBrundValidator,
  UpdateBrundServices
);

// delete

router.delete(
  "/:id",
  AuthService,
  allwodTo("admin"),
  DeleteBrundValidator,
  DeleteBrundServices
);

module.exports = router;
