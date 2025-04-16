// Import modules
const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')

// Create app
const app = express()

// set up middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true} ))


// set up '/api/v1/tours' route on app
app.use('/api/v1/tours', tourRouter)

module.exports = app