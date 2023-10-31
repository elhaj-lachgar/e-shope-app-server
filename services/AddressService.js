const asyncHandler = require("express-async-handler");

const UserModule = require("../module/UserModule");

exports.AddAdresseService = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const User = await UserModule.findOneAndUpdate(
    { _id: user._id },
    { $addToSet: { addresses: req.body } },
    { new: true }
  );

  return res
    .status(202)
    .json({ message: "add seccess to wish list ", data: User.addresses });
});

exports.RemoveAdresseService = asyncHandler(
  async (req, res, next) => {
    const { user } = req;

    const User = await UserModule.findOneAndUpdate(
      { _id: user._id },
      { $pull: { addresses: { _id: req.params.id } } },
      { new: true }
    );

    return res
      .status(202)
      .json({ message: "delete seccess to adressse ", data: User.addresses });
  }
);

exports.GetUserAdresseService = asyncHandler(async (req, res, next) => {
  const User = await UserModule.findById(req.user._id);

  res.status(201).json({ data: User.addresses, result: User.addresses.length });
});
