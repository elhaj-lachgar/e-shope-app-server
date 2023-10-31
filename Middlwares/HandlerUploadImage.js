
const asyncHendlerErrors = require('express-async-handler') 

const sharp = require('sharp');

const multer = require ('multer');

const { v4: uuidv4 } =require('uuid')


const MulterStorge = multer({storage : multer.memoryStorage()});

const ModifyImage = asyncHendlerErrors(async ( req , res , next ) => {
  if ( req.file ){
    const NameOfRouteWithQuery = req.baseUrl.split('\/')[3];
    const NameOfRoute = NameOfRouteWithQuery.split('?')[0];
    const { buffer } = req.file;
    const filename = `${NameOfRoute}-${uuidv4()}-${Date.now()}.jpeg`
    ImageParams( NameOfRoute , buffer , filename )
    req.body.profile= filename 
  }
  next();
})

exports.UplaodOneImageHandler = [
  MulterStorge.single('image'),
  ModifyImage
]

exports.UploadUserProfile = [
  MulterStorge.single('profile'),
  ModifyImage
]



const ModifyMultiImage = asyncHendlerErrors (async ( req , res , next ) => {
  if ( req.files ){
    const { image_cover , image } = req.files;
    const NameOfRouteWithQuery = req.baseUrl.split('\/')[3];
    const NameOfRoute = NameOfRouteWithQuery.split('?')[0];
    if ( image_cover ){
      const { buffer } = image_cover[0];
      const filename = `${NameOfRoute}-${uuidv4()}-${Date.now()}.jpeg`
      ImageParams( NameOfRoute , buffer , filename);
      req.body.image_cover = filename;
    }
    if (image) {
      let listName = image.map(( element , index ) => {
        const { buffer } = element;
        const filename = `${NameOfRoute}-${index}-${uuidv4()}-${Date.now()}.jpeg`;
        ImageParams( NameOfRoute , buffer , filename );
        return filename;
      });
      req.body.image = listName;
    }
  }
  next();
}
)

const ImageParams = ( routename , buffer , filename )=> {
  sharp( buffer )
  .resize(200,200)
  .toFormat('jpeg')
  .toFile(`upload/${routename}/${filename}`);
}

exports.UploadGroupeOfImage =[

  MulterStorge.fields([{name : 'image_cover' , maxCount : 1} , {name : 'image' , maxCount : 3 }]),

  ModifyMultiImage,

]