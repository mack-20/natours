// Import modules
const { Router } = require('express')
const { getAllTours, getTour, createTour, updateTour, deleteTour, getTopTours, getTourStats, getMonthlyPlan } = require('../controllers/tourControllers')
const { protect } = require('../controllers/authController')

// Create tour router
const tourRouter = new Router()

// monthly plan
tourRouter
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan)

// tour stats
tourRouter
  .route('/tour-stats')
  .get(getTourStats)

// top 5 tours
tourRouter
  .route('/top-5-tours')
  .get(getTopTours, getAllTours)

// Set up routes on '/'
tourRouter
  .route('/')
  .get(protect, getAllTours) // get all tours
  .post(createTour) // create new tour

tourRouter
  .route('/:id')
  .get(getTour) // get specific tour
  .patch(updateTour) // update tour
  .delete(deleteTour) // delete tour


  module.exports =  tourRouter