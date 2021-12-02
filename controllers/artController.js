const Art = require("../models/artModel")
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError");

exports.createArt = factory.createOne(Art)
exports.getAllArts = factory.getAll(Art)
exports.getArt = factory.getOne(Art)
exports.updateArt = factory.updateOne(Art)
exports.deleteArt = factory.deleteOne(Art)

// exports.getArt = () =>
//   catchAsync(async (req, res, next) => {
//     let query = await Art.findById(req.params.id).populate('reviews')  // Model.findOne({ _id: req.params.id })
//
//     const doc = await query
//     Art.findById(req.params.id)
//
//     if (!doc) {
//       return next(new AppError("No document found with that ID", 404));
//     }
//
//     res.status(200).json({
//       status: 'success',
//       data: {
//         doc,
//       },
//     });
//   })

//   async(req, res) => {
//   try {
//     // coming from url in the routes
//     await Art.findByIdAndDelete(req.params.id)
//
//     res.status(204).json({
//       status: 'success',
//       data: {
//         data: null
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     })
//   }
// }