
const mongoose = require("mongoose")

const { PopulateGenerator } =require('./MiddlwersOfDataBase');



const ProductSchema = new mongoose.Schema({

    title : {
        type : String ,
        required : [ true ,  'product of product is reqquired '] ,
        maxlength : [ 100 ,  ' title of product is to long '],
        minlenght : [ 3 , 'title of product is to short '],
        trim : true ,
    },
    slug: {
        type : String ,
        required  : true ,
        lowercase : true ,
        trim : true ,
    },
    description : {
        type :  String ,
        required : [ true , " description is required "],
        trim : true ,
        minlength : [ 20 , "description of product is to short "]
    },
    image_cover : {
        type  : String ,
        require : [ true , " image of cover is required "]
    },
    image : [String],
    categore :{
        type : mongoose.Schema.ObjectId ,
        ref : 'categore',
        required : [ true , "product must belown to category"]
    },
    subcategore : [ { 
        type : mongoose.Schema.ObjectId,
        ref : 'subcategore'
    }]
    ,
    brund : {
        type :  mongoose.Schema.ObjectId ,
        ref : 'Brund'
    },
    avg_rating : {
        type :  Number ,
        min : [ 1 ,"min rate is 1"],
        max : [ 5 , "max rate is  5"]
    },
    count_rate : {
        type :Number , 
        default : 0 
    },
    quantity : {
        type  : Number ,
        required : [ true , 'qantity is required in product'],
        default : 0 ,
    },
    price : {
        type : Number,
        trim : true ,
        required : [ true , 'price is required in product'],
    },
    discount_price :{
        type : Number 
    },
    sold : {
        type  : Number ,
        default : 0 ,
    },
    colors : [String]
},{timestamps : true ,
    // to active virtual 
    toJSON : { virtuals : true},
    toObject : { virtuals : true }
})


PopulateGenerator(ProductSchema , 'categore' , 'name');

ProductSchema.virtual("reviews" , {
    foreignField : 'product',
    localField : '_id',
    ref : 'review'
})

ProductSchema.post (["init" , "save"],  ( doucement ) => {
    if( doucement.image_cover ){
        const RouteName = doucement.image_cover.split('-')[0];
        const UrlOfImage = `${process.env.DOMAINE_NAME}/${RouteName}/${doucement.image_cover}`
        doucement.image_cover = UrlOfImage ; 
    }
    if ( doucement.image ){
        const ListName = doucement.image.map((ele) => {
            const RouteName = ele.split('-')[0];
            const UrlOfImage = `${process.env.DOMAINE_NAME}/${RouteName}/${ele}`
            return UrlOfImage;
        })
        doucement.image = ListName ;    
    }
})

PopulateGenerator(ProductSchema , 'reviews' , 'user rating content')

const ProductModule = mongoose.model('product' , ProductSchema);

module.exports = ProductModule ;