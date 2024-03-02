const express = require("express")

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
//static files from folder

// Routing using middleware
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

// Handling non specified urls
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server `, 404))
})

//Global error handling middleware

app.use(globalErrorHandler)

module.exports = app

// All the middlewares with err in their
// next will be sent to global error handling middleware
