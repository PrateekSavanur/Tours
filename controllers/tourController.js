/* eslint-disable node/no-unsupported-features/es-syntax */
// const fs = require("fs")
const Tour = require("../model/tourModel")

exports.getAllTours = async (req, res) => {
  try {
    //Build the query
    //Filtering
    const queryObj = { ...req.query }
    const excludedFields = ["page", "sort", "limit", "fields"]

    excludedFields.forEach((el) => delete queryObj[el])

    //Advance filtering

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      // query = query.select("name duration price")
      query = query.select(fields)
    } else {
      query = query.select("-__v") //minus means exclude
    }

    // Pagination
    // query = query.skip(2).limit(10)
    // 1- 10 page 1, 11-20 page 2 👆
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) {
        throw new Error("Page does not exist")
      }
    }
    //Execute the query
    console.log(query)
    const tours = await query
    //Send response
    res.status(200).json({
      status: "success",
      results: tours.length,
      requestedAt: req.requestTime,
      data: { tours: tours },
    })
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    })
  }
}

exports.createTour = async (req, res) => {
  // const nreTours = new Tour({})
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    })
  }
}
