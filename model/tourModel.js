const mongoose = require("mongoose")

const toursSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    // unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Tour must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have group size"],
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have difficulty"],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, "Tour must have a price"] },
  priceDiscount: Number,
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
})
// created a model
const Tour = mongoose.model("Tour", toursSchema)

module.exports = Tour
