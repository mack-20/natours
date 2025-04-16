const Tour = require('../models/tourModel')
const APIfeatures = require('../utils/APIfeatures')

// controller to GET ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()

    const { query, pagination } = await features.paginate()

    const tours = await query
    res.status(200).json({
      status: 'SUCCESS✔',
      //tourCount: tours.length,
      data: {
        tours
      },
      pagination
    })
  } catch (error) {
    res.status(400).json({
      status: 'FAIL🤦‍♂️',
      message: error.message
    })
  }
}

// controller to GET single tour
exports.getTour = async (req, res) => {
  try {
    const tourId = req.params.id
    const tour = await Tour.findById(tourId)

    res.status(200).json({
      status: 'SUCCESS✔',
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'FAIL🤦‍♂️',
      message: error.message
    })
  }
}

// controller to CREATE tour (POST)
exports.createTour = async (req, res) => {
  try {
    const tourContents = req.body
    const tour = await Tour.create(tourContents)

    res.status(201).json({
      status: 'SUCCESS✔',
      message: 'Tour created successfully',
      data: {
        tour
      }
    })

  } catch (error) {
    res.status(400).json({
      status: 'FAIL🤦‍♂️',
      message: error.message
    })
  }
}

// controller to UPDATE tour (PATCH)
exports.updateTour = async (req, res) => {
  try {
    const tourId = req.params.id
    const tourContentsToUpdate = req.body
    const options = { returnDocument: 'after' }
    const tour = await Tour.findByIdAndUpdate(tourId, tourContentsToUpdate, options)

    res.status(200).json({
      status: 'SUCCESS✔',
      message: 'Tour updated successfully',
      data: {
        tour
      }
    })

  } catch (error) {
    res.status(400).json({
      status: 'FAIL🤦‍♂️',
      message: error.message
    })
  }
}

// controller to DELETE tour (DELETE)
exports.deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id
    const tour = await Tour.findByIdAndDelete(tourId)

    res.status(204).json({
      status: 'SUCCESS✔',
      message: 'Tour deleted successfully'
    })

  } catch (error) {
    res.status(400).json({
      status: 'FAIL🤦‍♂️',
      message: error.message
    })
  }
}