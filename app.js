const express = require("express")
const fs = require("fs")
const morgan = require("morgan")

const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

//Middle ware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`)) //static files from folder

// Routing using middleware
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

module.exports = app
