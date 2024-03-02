// const fs = require("fs")
const Tour = require("../model/tourModel")
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,summary,difficulty"
  next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const tours = await features.query
  //Send response
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours: tours },
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    return next(new AppError(`No tour found with that id`, 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
})

exports.createTour = catchAsync(async (req, res, next) => {
  // const nreTours = new Tour({})
  const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!tour) {
    return next(new AppError(`No tour found with that id`, 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError(`No tour found with that id`, 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        num: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // }, can do matching multiple times
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: {
          $sum: 1,
        },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    // {
    //   $limit: 6,
    // }, limits output to 6
  ])

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  })
})

//Build the query

// Sorting

// Field Limiting

// Pagination
// query = query.skip(2).limit(10)
// 1- 10 page 1, 11-20 page 2 👆
