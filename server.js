// import packages 
const express = require('express') ;

const cors = require('cors')

const path = require('path')
// middlwere of loging 
const morgan = require('morgan')

// handle .env file
const dotenv = require('dotenv')

// class of same propritie of error 
const ErrorHandling = require('./utils/ErrorHandling')

// function of middlware handle error 
const ErrorMiddlwareHandler = require('./Middlwares/ErorrMiddlware')

// create node server 
const app =  express()

// compression methode
const compression = require ('compression')

// config to .env file
dotenv.config({path : './config.env'})

// route of categores 
const CategoreRoute = require('./api/CategoreRoute')

// route of subcategores 
const SubCategoreRoute = require ('./api/SubCategoreRoute')

// route of brunds
const BrundRoute = require('./api/BrundRoute')

// route of product 
const ProductRoute = require('./api/ProductRoute')

// route of user 
const UserRoute = require('./api/UserRoute')

// route of auth
const AuthRoute = require('./api/AuthRoute')
// router of review
const ReviewRoute = require('./api/ReviewRoute')

// router of wish list 
const WishListRoute = require('./api/WishList')

// router of adresses
const AddressRoute =  require('./api/AddresseRoute')

// route of coupon 
const CouponRoute = require ('./api/CouponRoute')

// router of card 
const CardRoute = require('./api/CardRoute')

// router of order 
const OrderRoute = require('./api/OrderRoute')

// function of coonection 
const DBconnected = require('./config/database')


// data base connection 
DBconnected()

// middlware loging => [ mean you will see  by it all req and type and more information ]
if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'))
}

// cors config
app.use(cors())
app.options('*', cors())

// comprision all resqiste
app.use(compression())

// middlware to parse  req(json)=> req(object)
app.use(express.json())



// alowd to surve the image file 

app.use(express.static(path.join(__dirname , 'upload')))


// route of categores 
app.use('/api/v1/categore' , CategoreRoute)


//  route of subcategores 
app.use('/api/v1/subcategore' , SubCategoreRoute)

// route of Brund 
app.use('/api/v1/brund' , BrundRoute)

// products  route 
app.use('/api/v1/products' , ProductRoute)

// user Route 
app.use('/api/v1/user' , UserRoute );

// auth Route 
app.use('/api/v1/auth', AuthRoute )

// review route
app.use('/api/v1/review', ReviewRoute )

// wishList route
app.use('/api/v1/wishlist' , WishListRoute)


// adderess route 
app.use('/api/v1/address' , AddressRoute)


// coupon route
app.use('/api/v1/coupon' ,CouponRoute)

// coupon route
app.use('/api/v1/card' , CardRoute) 

// order route 
app.use('/api/v1/order' , OrderRoute)


// routes can't found in application
app.all('*' , (req , res , next )=>{
    next(new ErrorHandling(`this routes it's not include in appliction : ${req.originalUrl}` , 404))
})


// middlware error handling 
app.use(ErrorMiddlwareHandler)


// port handler 
const server = app.listen(process.env.PORT, ()=>{ console.log('port is lisenine '   , process.env.PORT)})


// handle global erron nuhandler
process.on('unhandledRejection' , (err) =>{

    console.log(`unhandledRejection ${err}`)
    
// use it to shot down server after complete all requiste 
    server.close(()=>{
        console.log('app shot down ')
        process.exit(1)
    })
    
})