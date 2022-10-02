const fs = require('fs')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
//we made this so the user won't have to put this parameter in the query string, so we provide a well defined endpoint for this functionality
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingAverage,summary,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    //creating an APIFeature class that contains querying feature, in there we are passing the query object and the query string that is coming from the request. Note that find() is just a normal method just like sort and select methods that returns a query
    //NOTE THAT: new APIFeatures(Tour.find(), req.query) statement returns an object so im chaining the methods on the object not on the class
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    //EXECUTRE THE QUERY
    //features.query is the stacked query in our APIFeatures class
    const tours = await features.query
    res.status(200).json({ status: 'success', data: { tours } })
  } catch (err) {
    res.status(400).json({ status: "fail", message: `${err}` })
  }
}

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: newTour
    })
  } catch (err) {
    //bad request
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({ status: 'success', data: tour })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({ status: 'success', data: tour })
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({ status: 'success', data: { tour } })

  } catch (err) {
    res.status(404).json({ status: 'fail', message: err })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    //this method accepts an array of stages
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 0 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          numRatings: { $sum: '$ratingsQuantity' },
          num: { $sum: 1 }
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      // {
      //   $match: { num: { $ne: 4 } }
      // }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year
    const plan = await Tour.aggregate([
      {
        //unwind is gonna deconstruct an array field of the input document and then output one document for each element of the array
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
      // {
      //   $group: {
      //     _id: '$startDates',
      //     num: { $sum: 1 }
      //   }
      // }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `${err}`
    })
  }
}