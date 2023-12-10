const dotenv = require("dotenv")
const mongoose = require("mongoose")
const app = require("./app")

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

const toursSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    // unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "Tour must have a price"] },
})
// created a model
const Tour = mongoose.model("Tour", toursSchema)

const testTour = new Tour({
  name: "The Snow Hiker",
  rating: 4.9,
  price: 497,
})

testTour
  .save()
  .then((doc) => {
    console.log(doc)
  })
  .catch((err) => {
    console.log("Error ", err)
  })

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`app on port ${port}`)
})
