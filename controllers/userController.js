const User = require("../models/userModel");
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createUser = factory.createOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
exports.deleteUser = factory.deleteOne(User)

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});