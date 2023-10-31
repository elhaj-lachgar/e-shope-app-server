const asyncHandler = require("express-async-handler");

const UserModule = require("../module/UserModule");

exports.AddProductToWishListService = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const User = await UserModule.findOneAndUpdate(
    { _id: user._id },
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );

  return res
    .status(202)
    .json({ message: "add seccess to wish list ", data: User });
});

exports.RemoveProductFromWishListService = asyncHandler(
  async (req, res, next) => {
    const { user } = req;
    const { id } = req.params;

    const User = await UserModule.findOneAndUpdate(
      { _id: user._id },
      { $pull: { wishlist: id } },
      { new: true }
    );

    return res
      .status(202)
      .json({ message: "delete seccess to wish list ", data: User });
  }
);

exports.GetUserWishListService = asyncHandler(async (req, res, next) => {
  const wishlist = await UserModule.findById(req.user._id).populate("wishlist");

  res.status(201).json({ data: wishlist, result: wishlist.length });
});
