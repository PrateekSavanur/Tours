/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose")
const slugify = require("slugify")
// const validator = require("validator")

const toursSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less than or equal to 40 char"],
      minlength: [10, "A tour name must have more than or equal to 10 char"],
      // validator: [validator.isAlpha, "Tour name must only contain characters"], this will exclude spaces
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Tour must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have group size"],
      enum: {
        // Only for strings
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult",
      },
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Must be above 1"],
      max: [5, "Must be below 5"],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "Tour must have a price"] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current document on new document creation
          return val < this.price
        },
        message: "Discount {{VALUE}} must be less than price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Tour must have Summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7
  //When we want to use this, use regular function
})

//Document middleware - runs before save and create of document
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// toursSchema.post("save",function(doc,next){

// })

// Query middleware
toursSchema.pre(/^find/, function (next) {
  // all the strings that start with find 👆
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

toursSchema.post(/^find/, function (doc, next) {
  console.log(doc)
  console.log(`Quwey took ${Date.now() - this.start} ms`)
  next()
})

// Aggregation middleware
toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  next()
})

// created a model
const Tour = mongoose.model("Tour", toursSchema)

module.exports = Tour
