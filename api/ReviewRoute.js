const express = require("express");

const {
  CreateReviewService,
  DeleteReviewService,
  GetByIdReviewService,
  GetReviewOfProductService,
  GetReviewService,
  UpdateReviewService,
} = require("../services/ReviewService");

const {
  CreateReviewValidator,
  DeleteReviewValidator,
  GetByIdReviewValidator,
  UpdateReviewValidator,
} = require("../utils/Validitor/ReviewValidatior");

const { AuthService, allwodTo } = require("../services/AuthService");

// accces params of parent router
const router = express.Router({ mergeParams: true });

// Nested route

router.get("/",  GetReviewOfProductService);

// get all review

router.get("/allreview", GetReviewService);

// get specifique review

router.get("/:id", GetByIdReviewValidator, GetByIdReviewService);

// create review

router.post(
  "/",
  AuthService,
  allwodTo("user"),
  CreateReviewValidator,
  CreateReviewService
);

// update review

router.put(
  "/:id",
  AuthService,
  allwodTo("user"),
  UpdateReviewValidator,
  UpdateReviewService
);

// delete review

router.delete(
  "/:id",
  AuthService,
  allwodTo("user", "manager", "admin"),
  DeleteReviewValidator,
  DeleteReviewService
);


module.exports = router