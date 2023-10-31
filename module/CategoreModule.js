const { ImageUrlHandler } =require('./MiddlwersOfDataBase')

const mongoose = require('mongoose')

const SchemaCategore = new mongoose.Schema({
    name : {
        type : String ,
        maxlength : [ 32 , "name is to long "],
        minlength : [ 3 , "name is to short "],
        required : [ true , "name is required"],
        unique : [ true , "name is unique "],
    },
    slug : String ,
    image : String ,
},{timestamps : true,})
// create module 
ImageUrlHandler(SchemaCategore);
const  ModuleCategore = mongoose.model('categore' , SchemaCategore )


module.exports = ModuleCategore