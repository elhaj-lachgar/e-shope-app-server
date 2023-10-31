const express = require("express");


const { 
    SingInService, 
    SingUpService ,
    ForgotPassword ,
    VerfieRestCode ,
    RestPassword
} = require("../services/AuthService");

const {
  SingInValidator,
  SingUpValidator,
  ForgotPasswordValidator ,
  RestPasswordValidator ,
  VerfieRestCodeValidator
} = require("../utils/Validitor/AuthValidator");

const router = express.Router();

// create user 
router.post('/singup' , SingUpValidator , SingUpService );

// update user 
router.post('/singin' , SingInValidator , SingInService );


// forget password 

router.post('/forgetpassword' , ForgotPasswordValidator , ForgotPassword )

router.post('/verfierestcode', VerfieRestCodeValidator , VerfieRestCode)


router.post('/restpassword' , RestPasswordValidator , RestPassword )

module.exports = router ;