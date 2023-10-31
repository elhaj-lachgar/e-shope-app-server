const express = require("express");


// accces params of parent router 
const router = express.Router({ mergeParams : true});

const {AdditionMiddlwareUpdateSubCategore ,AdditionMiddlwareOfGetSubCategore} = require("../Middlwares/AdditionMiddlware")
const {
  CreateSubCategoreValidator,
  GetSubCategoreByIdValidator,
  UpdateSubCategoreValidator,
  DeleteSubcategoreValidator
} = require("../utils/Validitor/SubCategoreValidator");
const {
  CreateSubCategore,
  DeleteSubCategore,
  GetSubCategoreById,
  GetSubCategores,
  UpdateSubCategore,
} = require("../services/SubCategoreServices");

const {UplaodOneImageHandler } = require('../Middlwares/HandlerUploadImage')

const { AuthService, allwodTo } = require("../services/AuthService");

// http methode : get
router.get("/",GetSubCategores);
router.get("/:id", GetSubCategoreByIdValidator, GetSubCategoreById);

// http methode :post
router.post("/", AuthService , allwodTo ('admin' , 'manager'),UplaodOneImageHandler ,CreateSubCategoreValidator, CreateSubCategore);

// http method put
router.put("/:id", AuthService , allwodTo ('admin' , 'manager'),UplaodOneImageHandler,AdditionMiddlwareUpdateSubCategore,UpdateSubCategoreValidator , UpdateSubCategore);

// http method delete
router.delete("/:id", AuthService , allwodTo ('admin'), DeleteSubcategoreValidator ,DeleteSubCategore);

module.exports = router;
