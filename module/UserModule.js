
const mongoose =  require('mongoose');

const bycrypt = require('bcryptjs')


const UserSchema =  new mongoose.Schema({
    name : {
        type :  String,
        required : [ true , 'name is required'],
        minlength : [4 , 'name is to short'],
        maxlength : [ 32 , 'name is to long '],
        trim : true 
    },
    slug :  {
        type : String ,
        trim : true ,
        lowercase : true ,
    },
    email : {
        type : String ,
        required : [ true , 'email required'],
        unique : [ true , 'email must be unique'],
        lowercase : true,
    },
    passwordChangeAt : Date,
    profile : String,
    role : {
        type : String ,
        enum : [ "user" ,"admin" , "manager"],
        lowercase : true ,
        trim  : true ,
        default : "user"
    },
    passwordRestCode : String , 
    passwordRestCodeExpired  : Date ,
    passwordRestVerfie : Boolean , 
    active : {
        type : Boolean ,
        default : true 
    },
    password : {
        type :  String ,
        required :[ true , 'password is required '],
        minlength : [8 , 'password is to short ']
    },
    wishlist : [{
        type : mongoose.Schema.ObjectId,
        ref : 'product',
    }],
    addresses : [{
        id : { type : mongoose.Schema.ObjectId },
        city : String ,
        alias : String ,
        details : String ,
        phone : String ,
        code_postal : Number ,
    }]
},{ timestamps : true })

UserSchema.pre('save',  async function (next) {
    this.password = await bycrypt.hash(this.password , 12 );

    next();
})

UserSchema.post ( [ 'init' , 'save'] , function (  doc ) {
    if (doc.profile){
        const RouteName = doc.profile.split('-')[0];
        const UrlOfProfile = `${process.env.DOMAINE_NAME}/${RouteName}/${doc.profile}`
        doc.profile = UrlOfProfile ;
    }
})
const UserModule =  mongoose.model('user' , UserSchema );

module.exports = UserModule ;