const ErrorHandling = require("../utils/ErrorHandling");

const ApiFeature = require('../utils/ApiFeatures')

const expresshandlerasync = require("express-async-handler");

const slugfiy = require("slugify");

const ReviewModule = require('../module/ReviewModule');

const { CreateServiceHandler , DeleteServiceHandler  , UpdateServiceHandler , GetServiceHandler , GetByIdServiceHandler } = require('./FacteryHandler')


// url api/v1/review
// post 
// create review => user 
exports.CreateReviewService = CreateServiceHandler(ReviewModule , 'review' ) ;


// url api/v1/review
// delete 
// delete review => user + admin + manager
exports.DeleteReviewService = DeleteServiceHandler (ReviewModule);



// url api/v1/review/:reviewId 
// put 
// update review => user 
exports.UpdateReviewService = UpdateServiceHandler (ReviewModule , 'review');


// url api/v1/review
// get all review
exports.GetReviewService = GetServiceHandler(ReviewModule,'review');

// url api/v1/reviewid
// get spicifique review
exports.GetByIdReviewService = GetByIdServiceHandler(ReviewModule);


// url api/v1/product/productId/review
// get review  of spisicique product 
exports.GetReviewOfProductService = GetServiceHandler(ReviewModule)