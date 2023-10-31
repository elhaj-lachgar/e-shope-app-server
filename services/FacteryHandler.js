
const ErrorHandling = require("../utils/ErrorHandling");

const ApiFeature = require('../utils/ApiFeatures')

const expresshandlerasync = require("express-async-handler");

const ReviewModule = require('../module/ReviewModule')

const slugfiy = require("slugify");
const { query } = require("express");






exports.DeleteServiceHandler = (Module) =>  expresshandlerasync( async (req ,res ,next )=>{
    const { id } = req.params ;
    let  doucement = await Module.findById(id);
    if( doucement ){
        await doucement.deleteOne();
        return res.status(201).json({message : ' doucement is delete '})
    }
    next(new ErrorHandling("id is not found" , 404))
})




exports.UpdateServiceHandler =  ( Module , ModuleName  ) => expresshandlerasync ( async ( req , res , next ) => {

    if( ModuleName !== 'product' && req.body.name && ModuleName !== 'coupon' ){
        req.body.slug = slugfiy(req.body.name);
    }
    const { id } = req.params;
    const doucement = await Module.findOneAndUpdate(
      { _id: id },
        req.body,
      { new: true }
    );
    if(doucement){
      doucement.save();
      return  res.status(201).json(doucement)
    }
    
    return next( new ErrorHandling (" doucement not found" , 404))

}) 


exports.GetByIdServiceHandler =  ( Module,populateOpts ,ModuleName) =>  expresshandlerasync(async (req, res, next) => {
  
    const { id } = req.params;

    
    
    let doucement  = Module.findById(id);


    
    if(populateOpts) {
      doucement = doucement.populate(populateOpts)
    }
    const query = await doucement

    if (!query) {
      return next(new ErrorHandling("doucement not found", 404));
    }

    return res.status(201).json({ data: query});
  });



exports.CreateServiceHandler =  ( Module , NameModule ) => expresshandlerasync(async (req, res) => {
    if ( NameModule !== 'product' && req.body.name && NameModule != 'coupon'){
        req.body.slug = slugfiy (req.body.name)
    }
    else if ( NameModule == 'review') {
        req.body.user = req.user._id
    }
    else if ( NameModule == 'product') {
      req.body.slug = slugfiy(req.body.title)
    }

    const doucement = await Module.create(req.body);
  
    return res.status(201).json({data : doucement});
  });


exports.GetServiceHandler  = ( Module , NameModule ) => expresshandlerasync(async (req, res) => {
  
    if ( NameModule === 'subcategore') {
        const { CategoreId } = req.params;
        req.query.categore = CategoreId;
    }
    const totaleDucoment = await Module.countDocuments();
  
    const { pagination, MongooseQuery } = new ApiFeature(
      Module,
      req.query
    )
      .Filtre()
      .FieldsBy()
      .Pagination(totaleDucoment)
      .Sort()
      .SearchBy(NameModule);
  
    const doucement = await MongooseQuery;
  

    return res
      .status(201)
      .json({ result: doucement.length, pagination, data: doucement });
  });