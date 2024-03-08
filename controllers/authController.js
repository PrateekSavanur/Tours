const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const crypto = require("crypto")
const User = require("../model/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const sendEmail = require("../utils/email")

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  // JWT token created
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400))
  }

  const user = await User.findOne({ email }).select("+password") // marked as not selectes use "+"

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  // Get the token
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get accesed", 401),
    )
  }
  // Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // If user exists or not
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError("User belonging to token doesn't exist...", 401))
  }
  // If user changed password after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return new AppError("User changed password, Login again!!", 401)
  }

  // Grant access to protected route
  req.user = currentUser
  next()
})

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles [admin, lead-guide]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Donot have permission to perform this action", 403),
      )
    }

    next()
  }

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError("There is no user with email", 404))
  }

  // Generate random token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // Send back as email

  const resetUrl = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot your Password? Submit new patch with new password and to reset password use this link 👉👉 ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset Token valid for 10 min",
      message,
    })

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError("There was error sending email. Try again later", 500),
    )
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  // If token has not expired, then set new password
  if (!user) {
    return next(new AppError("Token expired", 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  // if (user.passwordConfirm !== user.password) {
  //   console.log("Error")
  //   return next(new AppError("ValidationError", 401))
  // }

  await user.save()

  // Update changedPasswordAt

  // Login user and send JWT
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select("+password")

  // Check if password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Wrong Password", 401))
  }
  // Update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm

  await user.save()

  // Login with new password
  createSendToken(user, 200, res)
})

//   {
//     "name": "Admin",
//     "email": "admin@natours.com",
//     "password": "pass12345",
//     "passwordConfirm": "pass12345",
//     "role":"admin"
// }

// role "user"
//
// name "Test user"
//
// email "test@gmail.com"
//     "password": "pass12345",
//     "passwordConfirm": "pass12345",
