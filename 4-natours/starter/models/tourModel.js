const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      index: true,
      unique: true,
      trim: true,
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      default: 'medium',
    },
    ratingAverage: { type: Number, default: 4.5 },
    ratingQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discount: { type: Number, default: 0 },
    summary: { type: String, trim: true },
    discription: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    image: [String],
    createdAt: { type: Date, default: Date.now() },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// ARREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
