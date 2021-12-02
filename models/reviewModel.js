const mongoose = require("mongoose")
const Art = require("./artModel")


const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, "Sorry, this field is required"]
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    // Parent Referencing
    art: {
      type: mongoose.Schema.ObjectId,
      ref: 'Art',
      required: [true, "Fill up the field"]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Fill up the field"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ art: 1, user: 1 }, { unique: true });

// Populating our art and user documents
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'art',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  })
  next();
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;