const express = require("express");

const {
  CreateUserService,
  DeleteUserService,
  GetUserByIdService,
  UpdateUserService,
  GetUsersService,
  ChangePasswordService,
  ChangePasswordLoggedUser,
  GetLoggedUserService,
  UpdateLoggedUser,
  ActivatedAccountUserLogged,
  DesactiveAccountUserLogged,
} = require("../services/UserService");

const {
  CreateUserValidator,
  DeleteUserValidator,
  GetUserByIdValidator,
  UpdateUserValidator,
  ChangePasswordValidator,
  UpdateLoggedUserValidator,
  ActiveAccountOfUserLoggedValidator,
  DesactiveAccountOfUserLoggedValidator,
} = require("../utils/Validitor/UserValidator");

const { UploadUserProfile } = require("../Middlwares/HandlerUploadImage");

const { AuthService, allwodTo } = require("../services/AuthService");

const router = express.Router();

// ###############admin#########

// channge passowrd
router.put(
  "/changePassword/:id",
  ChangePasswordValidator,
  ChangePasswordService
);

// get users

router.get("/", AuthService, allwodTo("admin"), GetUsersService);

// get target user by if

router.get(
  "/:id",
  AuthService,
  allwodTo("admin"),
  GetUserByIdValidator,
  GetUserByIdService
);

// create user

router.post(
  "/",
  AuthService,
  allwodTo("admin"),
  UploadUserProfile,
  CreateUserValidator,
  CreateUserService
);

// update user

router.put(
  "/:id",
  AuthService,
  allwodTo("admin"),
  UploadUserProfile,
  UpdateUserValidator,
  UpdateUserService
);

// delete user

router.delete(
  "/:id",
  AuthService,
  allwodTo("admin"),
  DeleteUserValidator,
  DeleteUserService
);

// #################### Loggeduser #################

router.get("/loggeduser", AuthService, GetLoggedUserService);

router.put("/loggeduser/changepassword", AuthService, ChangePasswordLoggedUser);

router.put(
  "/loggeduser",
  AuthService,
  UpdateLoggedUserValidator,
  UpdateLoggedUser
);

// #####################" Active / desctive user" ############ //

router.put(
  "/desactiveAccount",
  AuthService,
  allwodTo("user", "admin"),
  DesactiveAccountOfUserLoggedValidator,
  DesactiveAccountUserLogged
);
router.put(
  "/activeAccount",
  AuthService,
  allwodTo("user", "admin"),
  ActiveAccountOfUserLoggedValidator,
  ActivatedAccountUserLogged
);

module.exports = router;
