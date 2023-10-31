const mongoose = require('mongoose');
const { ImageUrlHandler } =require('./MiddlwersOfDataBase')

const BrundSchema = new mongoose.Schema({
    name : {
        type : String ,
        maxlength : [ 32 , "name is to long "],
        minlength : [ 3 , "name is to short "],
        required : [ true , "name is required"],
        unique : [ true , "name is unique "],
    },
    slug : String ,
    image :  String ,
},{ timestamps : true } )
ImageUrlHandler(BrundSchema);

const BrundModule = mongoose.model('Brund' , BrundSchema );

module.exports = BrundModule ;