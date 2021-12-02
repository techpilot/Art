const mongoose = require("mongoose")
const slugify = require("slugify")

const artSchema = new mongoose.Schema(
  {
    name: {
      unique: [true, "This name already exists in the database"],
      type: String,
      required: [true, "An art should have a name"],
      trim: true
    },

    artist: String,
    image: String,
    category: {
      type: String,
      default: "exhibition"
    },
    startDate: Date,
    endDate: Date,
    location: String,
    private: {
      type: Boolean,
      default: false
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "Provide a summary for this art work"]
    },

    description: {
      type: String,
      trim: true
    },
    // review: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Review',
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// artSchema.set('toObject', { virtuals: true });
// artSchema.set('toJSON', { virtuals: true });


artSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'art'
});

// artSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'review',
//     select: 'review'
//   })
//   next()
// })

artSchema.pre("save", (function (next) {
  this.slug = slugify(this.name, {lower: true});
  next();
}))

const Art  = mongoose.model("Art", artSchema);
module.exports = Art
