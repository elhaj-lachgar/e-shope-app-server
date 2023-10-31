const asynchandler = require("express-async-handler");

const CardModule = require("../module/CardModule");
const ErrorHandling = require("../utils/ErrorHandling");

const CouponModule = require('../module/CouponModule')

// user create or add tc card
// post
// url /api/v1/card
exports.AddToCardService = asynchandler(async (req, res, next) => {
  const { quantity, color, Product } = req.body;

  
  let  card = await CardModule.findOne({ user: req.user._id});

  if (!card) {
      card = await CardModule.create({
      user: req.user._id,
      card_items: [
        { product: Product._id, price: Product.price, color, quantity },
      ],
    });
  } else {
    const findProduct = card.card_items.findIndex(
      (ele) =>
        ele.product.toString() === Product._id.toString() && ele.color === color
    );

    if ( findProduct > -1 ){
      card.card_items[findProduct].quantity += quantity ;
    }
    else{
      card.card_items.push({ product: Product._id, price: Product.price, color, quantity })
    }
  }
  
  let totale_amount = 0 ;

  card.card_items.forEach(element => {
    totale_amount += element.quantity * element.price 
  });

  card.totale_amount = totale_amount ;

  await card.save();

  return res.status(202).json({ message : 'add success' ,  data : card } )
});

// get user card
// get 
// url /api/v1/card
exports.GetCardOfLoggedUser =  asynchandler ( async ( req , res , next )=> {
  const card = await CardModule.findOne({user : req.user._id}).populate('user').populate({path : 'card_items' , populate :'product'});

  if ( ! card ) return next ( new ErrorHandling ('this user had not card' , 404 ))
  return res.status(201).json({ data : card })
})

// remove product from card 
// delete 
// url /api/v1/card/:id

exports.DeleteProductFromCardOfUserLogged = asynchandler ( async ( req ,res , next)=> {


  const { productId  } = req.body ;
  let  card = await CardModule.findOne({ user : req.user._id});

  if ( ! card ) return next ( new ErrorHandling ('this user had not card' , 404 ))

  const productexc = card.card_items.findIndex((ele)=>ele.product.toString() === productId);

  
  if( productexc <= - 1 ) return next ( new ErrorHandling ('this product not include in this card ' , 404 )) ;

  const value = card.card_items.splice(productexc , 1 );



  card.totale_amount -= value[0].price * value[0].quantity; 


  await card.save();


  return res.status(201).json({data : card})
})


exports.ClearCardOfUserLogged = asynchandler ( async ( req , res , next ) => {
  
  let  card = await CardModule.findOne({user : req.user._id}) ;
  
  if ( ! card ) return next ( new ErrorHandling ('this user had not card' , 404 ));

  card.card_items.splice(0,card.card_items.length);

  card.totale_amount = 0 ; 

  await card.save();

  return res.status(201).json({ message : 'clear succss' , data : card})
})


exports.UpdateQuantityOfProduct = asynchandler ( async ( req , res , next ) => {
  const { quantity  , productId } = req.body;


  let  card = await CardModule.findOne({user : req.user._id}) ;
  
  if ( ! card ) return next ( new ErrorHandling ('this user had not card' , 404 ));

  const productexc = card.card_items.findIndex(
    (ele) =>
      ele.product.toString() === productId  
  );

  if ( productexc <= -1 ) return next ( new ErrorHandling ('this product not include in card' , 404 )) ; 

  const currentQuantity = card.card_items[productexc].quantity ;

  card.card_items[productexc].quantity = quantity ;

  card.totale_amount += (quantity * card.card_items[productexc].price) - (currentQuantity * card.card_items[productexc].price)  ;

  await card.save();

  return res.status(201).json({message : 'update success' , data : card });

})

exports.ActivateCouponService  = asynchandler ( async ( req , res , next ) => {
  
  const card =  await CardModule.findOne({user : req.user._id}) ;

  if ( ! card ) return next ( new ErrorHandling ('this user had not card' , 404 ));

  const coupon = await CouponModule.findOne({name : req.body.coupon}) ;

  if ( ! coupon ) return next ( new ErrorHandling ('coupon not found' , 404 ));

  if ( coupon.expired <= Date.now()) {
    await coupon.deleteOne();
    return next ( new ErrorHandling ('coupon not found' , 404 ));
  }

  card.totale_amount_discount = card.totale_amount - (card.totale_amount * coupon.discount / 100 );


  await card.save();

  return res.status(201).json({ message : 'discount success' , data : card }) ;

})