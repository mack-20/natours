// Import modules
const { Router } = require('express')
const { getAllTours, getTour, createTour, updateTour, deleteTour } = require('../controllers/tourControllers')

// Create tour router
const tourRouter = new Router()

// Set up routes on '/'
tourRouter
  .route('/')
  .get(getAllTours) // get all tours
  .post(createTour) // create new tour

tourRouter
  .route('/:id')
  .get(getTour) // get specific tour
  .patch(updateTour) // update tour
  .delete(deleteTour) // delete tour


  module.exports =  tourRouter