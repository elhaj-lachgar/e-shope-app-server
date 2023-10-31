const UserModule = require("../module/UserModule");
const asyncHandler = require("express-async-handler");
const bycrypt = require("bcryptjs");
const ApiErorrs = require("../utils/ErrorHandling");
const jwt = require('jsonwebtoken')

const {
  CreateServiceHandler,
  DeleteServiceHandler,
  GetByIdServiceHandler,
  GetServiceHandler,
  UpdateServiceHandler,
} = require("./FacteryHandler");

// Methode POST
// url api/v1/user
// desc :  create user
exports.CreateUserService = CreateServiceHandler(UserModule, "user");

// Methode PUT
// url api/v1/user/:id
// desc : update user

exports.UpdateUserService = UpdateServiceHandler(UserModule, "user");

// Methode DELETE
// url api/v1/user/:id
// desc : delete user

exports.DeleteUserService = DeleteServiceHandler(UserModule);

// get user
// get
//  api/v1/user

exports.GetUsersService = GetServiceHandler(UserModule, "user");

// get user  by id
// get
// url  /api/v1/user/:id

exports.GetUserByIdService = GetByIdServiceHandler(UserModule);


// #################user logged #######################//


// change user  by
// put
// url  /api/v1/changepassword/:id
exports.ChangePasswordService = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { id } = req.params;
  const User = await UserModule.findOneAndUpdate(
    { _id: id },
    { password:  bycrypt.hashSync(password) , passwordChangeAt : Date.now() },
    { new: true }
  );
  if (!User) {
    return next(new ApiErorrs("user not found", 404));
  }
  return res.status(201).json({ data: User });
});



exports.GetLoggedUserService = asyncHandler ( async ( req , res , next ) => {
  req.params.id = req.user._id;
  next();
})



exports.ChangePasswordLoggedUser =  asyncHandler (async ( req , res , next ) => {
  const { _id } = req.user;
  const user  = await UserModule.findById(_id);
  if (!user) {
    return next(new ErrorHandling("product not found", 404));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });
  return res.status(201).json({ data: user , token});
})


exports.UpdateLoggedUser =  asyncHandler ( async ( req ,res , next ) => {
  const { email , phone , name } =  req.body;
  const {_id} = req.user ; 
  const user = await UserModule.findOneAndUpdate({_id} , { email , phone , name } , { new : true });
  if ( ! user ){
    return next ( new ApiErorrs ('user not fond' , 404))
  }
  return res.status(201).json({data : user})
})




exports.DesactiveAccountUserLogged = asyncHandler ( async ( req ,res , next ) => {
  const { _id }  = req.user ;
  const user = await UserModule.findOneAndUpdate({_id} , { active : false });

  return res.status(200).json({ message  : 'user had beeing desactive'});
})



exports.ActivatedAccountUserLogged =  asyncHandler ( async ( req , res , next ) => {
  const { email , password } = req.body;
  const user = await UserModule.findOne({ email})

  if (!user) return next (new ApiErorrs ('user not found ' , 404));

  const Isvalid = bycrypt.compareSync(password , user.password);

  if ( !Isvalid ) return next (new ApiErorrs ('password not correct' , 401));

  user.active = true ;

  await user.save();

  const token = jwt.sign({ userId : user._id }, process.env.JWT_SCERET, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });


  return res.status(201).json({ data : user , token})

})

