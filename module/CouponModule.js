
const mongoose = require('mongoose' ) ;

const CouponSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true ,
        required : [ true , 'name is required '] ,
        unique : [ true , 'coupon name must be unique']
    },
    expired : {
        type : Date ,
        required : [ true , 'expirad date']
    } ,
    discount : {
        type : Number ,
        required : [ true , 'dicount is required']
    }

} ,{timestamps : true})



const CouponModule = mongoose.model('coupon' , CouponSchema ) ;

module.exports = CouponModule ;