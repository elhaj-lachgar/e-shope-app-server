

const mongoose = require ('mongoose') ;

const CardSchema = new mongoose.Schema({

    card_items : [
        {
            product : {
                type : mongoose.Schema.ObjectId ,
                ref : 'product' , 
                required : [ true ,  'product is required ']
            },
            quantity : {
                type :Number ,
                default : 1 ,
            }
            ,
            color : String ,
            price : Number
        } 
    ],

    totale_amount : Number ,
    totale_amount_discount : Number ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'user'
    }

},{timestamps : true})



const CardModule =  mongoose.model('card' , CardSchema)


module.exports = CardModule ;