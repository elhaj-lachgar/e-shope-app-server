const express = require("express");

const {
  RemoveAdresseService,
  GetUserAdresseService,
  AddAdresseService,
} = require("../services/AddressService");



const {
  AddAdresseValidator,
  RemoveAddresseValidator,
} = require("../utils/Validitor/AddressValidator");


const { AuthService, allwodTo } = require("../services/AuthService");


const router = express.Router();


// add address 
router.post(
  "/add",
  AuthService,
  allwodTo("user"),
  AddAdresseValidator,
  AddAdresseService
);

// remove address 
router.delete(
  "/remove/:id",
  AuthService,
  allwodTo("user"), 
  RemoveAddresseValidator,
  RemoveAdresseService
);


// get address of user 
router.get("/", AuthService, allwodTo("user"), GetUserAdresseService);


module.exports = router ;