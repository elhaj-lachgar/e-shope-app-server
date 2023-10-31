const express = require("express");

const {
  AddProductToWishListService,
  RemoveProductFromWishListService,
  GetUserWishListService
} = require("../services/WishList");

const {
  AddProductToWishListValidator,
  RemoveProductFromWishListValidator,
} = require("../utils/Validitor/WishListValidator");


const { AuthService , allwodTo  } =require('../services/AuthService')

const router = express.Router();


// add to wish list 
router.post(
  "/add",
  AuthService,
  allwodTo('user'),
  AddProductToWishListValidator,
  AddProductToWishListService
);



// remove to wish list 
router.delete(
  "/remove/:id",
  AuthService,
  allwodTo('user'),
  RemoveProductFromWishListValidator,
  RemoveProductFromWishListService
);


// get wish list of user 

router.get(
  "/",
  AuthService,
  allwodTo('user'),
  GetUserWishListService
);

module.exports = router ;