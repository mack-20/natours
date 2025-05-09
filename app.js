// Import modules
const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

// Create app
const app = express()

// set up middleware
app.use(morgan('dev')) // Logging request details
app.use(express.json()) // Parsing JSON data ???
app.use(express.urlencoded({ extended: true} )) // Parsing the URL params


// set up '/api/v1/tours' route on app
app.use('/api/v1/tours', tourRouter)

// handling routes not on the server
// the idea is that, the code will only get here if it has not been handled by any of the routes above hence rendering it invalid
// Express 5.0 uses actual regex now
app.all(/(.*)/, (req, res, next) => {
  const error = new AppError(`Can't find requested URL (${req.originalUrl}) on this server.`, 404)
  next(error)
})


// Error Handling Middleware
// Should be the last middleware to be defined
app.use(globalErrorHandler)


module.exports = app