const mongoose = require('mongoose')

const { ImageUrlHandler  } =require('./MiddlwersOfDataBase')
const SchemaSubCategore = new mongoose.Schema({
    name : {
        type : String ,
        maxlength : [ 32 , "name is to long "],
        minlength : [ 2 , "name is to short "],
        required : [ true , "name is required"],
        unique : [ true , "name is unique "],
    },
    slug : String ,
    categore :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'categore',
        required : [ true, "categore is required"],
    },
    image : String,
},{timestamps : true,})
// create module 


ImageUrlHandler(SchemaSubCategore)

const  ModuleSubCategore = mongoose.model('subcategore' , SchemaSubCategore )


module.exports = ModuleSubCategore