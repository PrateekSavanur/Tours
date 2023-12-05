const fs = require("fs")

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "No tour found",
    })
  }
  next()
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "failed",
      message: "Missing name/price",
    })
  }
  next()
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours: tours },
  })
}

exports.getTour = (req, res) => {
  const id = req.params.id * 1 //convert to int
  const tour = tours.find((el) => el.id === id)

  res.status(200).json({ status: "success", tour: tour })
}

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1

  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      })
    }
  )
}

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour will be sent here",
    },
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  })
}
