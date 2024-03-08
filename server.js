const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config({ path: "./config.env" })
const app = require("./app")

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true, // Just to avoid deprecation warnings
  })
  .then(() => {
    console.log("Database connection successful")
  })

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`app on port ${port}`)
})

// Unhandled rejection handling

process.on("UnhandledRejection", (err) => {
  console.log(err.name, err.message)
  console.log("Unhandled rejection ❌💥 Shutting down")
  // Complete all the requests and then end
  // server.close(() => {
  //   process.exit(1)
  // })
})

process.on("uncaughtException", (err) => {
  console.log(err.name)
  console.log("Uncaught Exception ❌💥 Shutting down.............")
  // Complete all the requests and then end
  // server.close(() => {
  //   process.exit(1)
  // })
})
