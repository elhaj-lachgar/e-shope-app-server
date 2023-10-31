const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const ErrorHandling = require("../utils/ErrorHandling");


exports.AdditionMiddlwareUpdateSubCategore = (req, res, next) => {
  const { categore, name } = req.body;
  if (categore) {
    if (mongoose.isValidObjectId(categore)) return next();
    return next(new ErrorHandling("categore id unvalid ", 404));
  }
  req.body = { name };
  next();
};


exports.AdditionMiddlwareOfNestedRoute =  (req , res  , next)=>{
  const { CategoreId } = req.params; 
  const { name } = req.body;
  req.body = {
    categore : CategoreId ,
    name ,
  }
  return next()
}



exports.AdditionMiddlwareOfHandleTitleSlugfiy = ( req , res , next ) => {
  if ( req.body.title && req.body.title !== undefined ){
    req.body = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...req.body,
      slug : slugify(req.body.title),
    }
    return next()
  }
  return next();
}

