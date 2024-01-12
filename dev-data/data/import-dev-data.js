const fs = require("fs")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const Tour = require("../../model/tourModel")

dotenv.config({ path: "./config.env" })

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

//Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
)

// Import data to DB
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log("Data successfully loaded")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

// Delete all data from database

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log("Data Deleted successfully")
  } catch (error) {
    console.log(error)
  }
  process.exit()
  //very aggressive way to end app but here it is fine
}

if (process.argv[2] === "--import") {
  importData()
} else if (process.argv[2] === "--delete") {
  deleteData()
}
