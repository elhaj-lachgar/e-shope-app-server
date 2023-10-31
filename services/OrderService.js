
const asynchandler = require ('express-async-handler') ;

const OrderModule = require ('../module/OrderModule') ;

const ApiError =  require('../utils/ErrorHandling')

const CardModule =  require('../module/CardModule')

const ProductModule =  require('../module/ProductsModule')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const {GetServiceHandler , GetByIdServiceHandler} = require('./FacteryHandler')

// url :  api/v1/order
// create order
// post

exports.CreateOrderService = asynchandler ( async ( req , res , next ) => {


    

    // get card 
    const card = await CardModule.findOne({user : req.user._id});


    // check if exisect this card 
    if ( ! card ) return next(new ApiError ( 'this user  has no  card  ' , 404 ));


    // check if card_items
    if (  card.card_items.length <=  0  ) return next(new ApiError ( 'this user  has no  element in card  ' , 404 ));
    // create object of order

    let ObjOrder = {} ;
    ObjOrder.card_items =  card.card_items ; 
    ObjOrder.schoppingPrice = 20 ;
    ObjOrder.taxPrice = 1.2 ;
    ObjOrder.totaleOrderPrice = card.totale_amount + ObjOrder.schoppingPrice + ObjOrder.taxPrice ; 
    ObjOrder.user = req.user._id;
    ObjOrder.schoppingAddresse = req.body;

    // if this card had coupon

    if ( card.totale_amount_discount ) {
        ObjOrder.schoppingPrice = card.totale_amount_discount ;
    }
    
    const order = await OrderModule.create(ObjOrder);


    // check if roder existe
    if ( order ) {
        //  decrement and increment qunatity and sold
        card.card_items.forEach( async (element) => {
            const product = await ProductModule.findOne({_id : element.product });
            product.sold += element.quantity ;
            product.quantity -= element.quantity ;
            await product.save();
        })
    
        // clear card 
    
        await card.deleteOne();
    
    } 

    return res.status(201).json({ message : 'order creation success ' , data : order});
});



// admin
// get all orders
exports.GetAllOrderService =  GetServiceHandler (OrderModule , 'order') ;

// get order of user 
// userlogged
exports.GetOrderOfLoggedUser =  asynchandler ( async ( req , res , next ) => {

    const { _id } = req.user ;

    const order = await OrderModule.find({user : _id }) ;

    if (! order ) return next(new ApiError('this user has no order') , 404);

    return res.status(201).json({result : order.length , data : order });
})


// order update 
// admin
// url : api/v1/order/:id
exports.UpdateStatusOfTaxAndShopeProductService = asynchandler ( async ( req , res , next ) => {

    console.log(req.body);

    const order = await OrderModule.findOneAndUpdate({_id : req.params.id} , req.body ,{ new : true});


    if ( ! order ) next(new ApiError('order not found' , 404)) ;

    return res.status(201).json({message : 'update success' , data : order})
})


exports.UpdateStatusOfPaidProductService = asynchandler ( async ( req , res , next ) => {


    const order = await OrderModule.findOne({_id :req.params.id} );


    if ( ! order ) next(new ApiError('order not found' , 404)) ;

    order.paidAt = Date.now();
    order.isPaid = true ;
    
    const New_order = await order;

    return res.status(201).json({message : 'update success' , data : New_order})
})

exports.UpdateStatusOfDelaiverProductService = asynchandler ( async ( req , res , next ) => {


    const order = await OrderModule.findOne({_id :req.params.id} );


    if ( ! order ) next(new ApiError('order not found' , 404)) ;

    order.deliverdAt = Date.now();
    order.isDeliverd = true ;

    const New_order = await order;

    return res.status(201).json({message : 'update success' , data : New_order})
})



exports.CreatePayementSession =  asynchandler ( async ( req , res , next ) => {

    const { cardId } = req.params;

    const card = await CardModule.findOne({_id : cardId , user : req.user._id}) ;

    if ( ! card ) return next( new ApiError ('this card not found' , 404 ));
    
    // handleTotaleAmount

    let totale_amount = card.totale_amount

    if ( card.totale_amount_discount ) {
        totale_amount = card.totale_amount_discount;
    }

    console.log(card)

    const session =  await stripe.checkout.sessions.create({

        mode: 'payment',
        success_url: `${process.env.DOMAINE_NAME}/api/v1/order`,
        cancel_url: `${process.env.DOMAINE_NAME}/api/v1/card`,
        customer_email : req.user.email,
        client_reference_id : card._id ,

        line_items: [
            {

                price_data:{
                    currency : 'mad',
                    product_data : {
                        name : req.user.name.toString()
                    } ,
                    unit_amount_decimal : totale_amount * 100 ,
                },
                quantity : 1 ,

            },

          ],
    })


    return res.status(201).json({data : session})
})