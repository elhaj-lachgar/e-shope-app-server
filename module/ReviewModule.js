const mongoose = require("mongoose");

const ProductModule = require("./ProductsModule");

const { PopulateGenerator } = require("./MiddlwersOfDataBase");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user info is required"],
    },
    content: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating is great than 1"],
      max: [5, "rating is lower than 5"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true }
);

PopulateGenerator(ReviewSchema, "user", "name");

ReviewSchema.statics.CalcAvgSumOfRating = async function (productId ) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        rating_avg: { $avg: "$rating" },
        rating_count: { $sum: 1 },
      },
    },
    
  ]);

  if (result.length > 0) {
    const product = await ProductModule.findOneAndUpdate(
      { _id: productId },
      { avg_rating: result[0].rating_avg, count_rate: result[0].rating_count }
    );
  } else {
    const product = await ProductModule.findOneAndUpdate(
      { _id: productId },
      { avg_rating: 0, count_rate: 0 }
    );
  }

};




ReviewSchema.post('deleteOne', {document : true , query : false} ,async function ( doc ) {
    this.constructor.CalcAvgSumOfRating(this.product);
}); 

ReviewSchema.post("save", async function () {
    await this.constructor.CalcAvgSumOfRating(this.product);
});

const ReviewModule = mongoose.model("review", ReviewSchema);



module.exports = ReviewModule;
