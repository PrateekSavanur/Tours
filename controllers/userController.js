const fs = require("fs")
const User = require("../model/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find()
  //Send response
  res.status(200).json({
    status: "success",
    results: user.length,
    requestedAt: req.requestTime,
    data: { users: user },
  })
})

exports.updateMe = async (req, res, next) => {
  // Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This is not to update password", 400))
  }

  // update user doc, filtered unwanted data like resetTOken
  const filteredBody = filterObj(req.body, "name", "email")
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
}

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  })
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  })
}
