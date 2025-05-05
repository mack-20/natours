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

// handling routes not on the server
// the idea is that, the code will only get here if it has not been handled by any of the routes above hence rendering it invalid
// Express 5.0 uses actual regex now
app.all(/(.*)/, (req, res, next) => {
  res.status(404).json({
    status: 'FAIL🤦‍♂️',
    message: `Could not find ${req.originalUrl} on the server!`
  })
})

module.exports = app