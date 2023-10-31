const asynchandler = require("express-async-handler");

const CouponModule = require("../module/CouponModule");

const {
  CreateServiceHandler,
  DeleteServiceHandler,
  UpdateServiceHandler,
  GetByIdServiceHandler,
  GetServiceHandler,
} = require("./FacteryHandler");

// create coupon code
// post
// url api/v1/coupon

exports.CreateCouponService = CreateServiceHandler(CouponModule, "coupon");

// delete coupon code
// delete
// url api/v1/coupon/:id

exports.DeleteCouponService = DeleteServiceHandler(CouponModule);

// update coupon code
// put
// url api/v1/coupon/:id

exports.UpdateCouponService = UpdateServiceHandler(CouponModule, "coupon");

// get coupon by name
// get
// url api/v1/coupon/:name

exports.GetCouponByIdService = GetByIdServiceHandler(CouponModule);

// get all coupon
// get
// url api/v1/coupon

exports.GetCouponService = GetServiceHandler(CouponModule, "coupon");
