const crypt = require('crypto')

const jwt = require("jsonwebtoken");

const bycrypt = require("bcryptjs");

const ApiError = require("../utils/ErrorHandling");

const asynchandler = require("express-async-handler");

const UserModule = require("../module/UserModule");

const SendEmail = require('../utils/SendEmail')

exports.SingUpService = asynchandler( async (req, res, next) => {
  // create user
  const user = await UserModule.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

  delete user.password;

  return res.status(201).json({ data: user, token });
});


exports.SingInService = asynchandler( async (req, res, next) => {
  const { email, password } = req.body;

  
  const user = await UserModule.findOne({ email });

  if ( ! user  ) return next(new ApiError ('incorrect email , please check again') , 404)

  const valid = bycrypt.compareSync(password, user.password);

  if (!valid) {
    return next(new ApiError("password incorect", 404));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

  return res.status(201).json({ data: user, token: token });
});


exports.AuthService   = asynchandler( async (req, res, next) => {
  // check if there is  token
  if (req.headers.authorization) {
    // 1-get token from headers
    const token = req.headers.authorization.split(" ")[1];
    //Bearer[0] token [1]  


    // 2-verfie token
    const validToken = jwt.verify(token, process.env.JWT_SCERET);

    // 3-check user in db
    if (validToken.userId) {
      const user = await UserModule.findById(validToken.userId);
      if (!user) {
        return next(new ApiError("user not found ", 401));
      }
      // check if user change here password
      if (user.passwordChangeAt) {
        const durationChangePassword = parseInt(user.passwordChangeAt / 1000);
        // check if user change the password after jenerate token
        // check if ther'is any probleme ( iat => means what )
        if ( durationChangePassword > validToken.iat) {
          return next(
            new ApiError(
              "user change password recently , please login again ",
              401
            )
          );
        }
      }
      if ( !user.active ) return next( new ApiError ('your account had beeing desactived you have to active',401))
      req.user = user ;
      return next();
    }
  }
  return next(new ApiError("unauthrize", 401));
});


exports.allwodTo  =  ( ...roles ) => asynchandler (async ( req ,res , next ) => {
  const { user } = req ;
  if ( !roles.includes(user.role)){
    return next( new ApiError ('this user is not allwod to access this action' , 403 ))
  }
  next();
})


exports.ForgotPassword = asynchandler ( async ( req , res , next ) => {
  // check if user existe or not 
  const { email } = req.body ;
  const user = await UserModule.findOne({ email });
  if ( ! user ){
    return next( new ApiError ('this email not existe' , 404))
  };

  // generete rand code 
  const RestCode = Math.floor(100000 + Math.random()*900000 ).toString();



  // hashing rest code 
  const HashedCode = crypt.createHash('sha256').update(RestCode).digest('hex');

  // save rest code db
  user.passwordRestCode = HashedCode;
  user.passwordRestCodeExpired = Date.now() + 10 * 60 * 1000 ;
  user.passwordRestVerfie = false ;
  // save on user 
  await user.save();

  // 3-send email 


  try{
    await SendEmail ( email , RestCode ,  user.name );
    return res.status(201).json({ message : 'send email success' , satuts : 'success'  })
  }
  catch(err){
    user.passwordChangeAt  = undefined ;
    user.passwordRestCode = undefined ;
    user.passwordRestCodeExpired = undefined ;
    await user.save()
    return next( new ApiError (err.message , 401))
  }
  
})




exports.VerfieRestCode =  asynchandler ( async ( req , res ,next ) => {
  const { restCode } = req.body ;
  const hashedCode =  crypt.createHash('sha256').update(restCode).digest('hex');

  const user = await UserModule.findOne({ passwordRestCode : hashedCode} ) ;

  
  if ( ! user ) return next( new ApiError ('rest code not correct', 401));
  user.passwordRestVerfie = true;
  await user.save();
  return res.status( 201).json({ message :  'rest code is correcte '})
})


exports.RestPassword = asynchandler ( async ( req , res , next ) => {

  const { email  , newpassword } = req.body ;

  const user = await UserModule.findOne({email, passwordRestCodeExpired : {$gt : Date.now()}});


  if ( ! user ) return next(new ApiError ('user not found or rest code is expired please try again' , 404 ));

  if ( ! user.passwordRestVerfie ) return new next(new ApiError  ('you have to send corrected rest code' , 401));

  user.password = newpassword ;
  user.passwordRestVerfie = undefined ;
  user.passwordRestCode = undefined ;
  user.passwordRestCodeExpired = undefined ;
  await user.save()
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

  return res.status(202).json({ data : user ,  token })

})