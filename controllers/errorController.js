const AppError = require("../utils/appError")

module.exports = (error, req, res, next) => { 
  // This is done to ensure that if err.status is not set, we have a default state for it. same applies to err.statusCode
  // This is helps standardize error responses
  error.status = error.status || 'error'
  error.statusCode = error.statusCode || 500

  const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
      status: error.status,
      stack: error.stack,
      error: error,
      message: error.message
    })
  }

  const sendErrorProd = (error, res) => {
    // if error is an operational error then we can display to client
    if (error.isOperational){
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })  
    }
    // else we display generic message to client
    else{
      console.error(error)

      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`
    return new AppError(message, 400)
  }

  const handleValidationErrorDB = (error) => {
    return new AppError(error.message, 400)
  }

  const handleDuplicateKeyErrorDB = (error) => {
    const message = `Tour '${error.keyValue.name}' already exists!`
    return new AppError(message, 400)
  }

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(error, res)
  }
  else if (process.env.NODE_ENV === 'production'){
    let finalError

    // Handle Cast Error
    if(error.name === 'CastError') finalError = handleCastErrorDB(error)

    // Handle Validation Error
    if(error.name === 'ValidationError') finalError = handleValidationErrorDB(error)

    // Handle duplicate key error
    if(error.code === 11000) finalError = handleDuplicateKeyErrorDB(error)

    sendErrorProd(finalError, res)
  }
  next()
}

// Errors we need to mark as operational
// 1. duplicate key : Occurs on unique index violation (e.g. duplicate email).
// 2. Validation errors: Occurs when data doesn't match the schema.
// 3. CastError: Occurs when invalid ObjectIds or wrong data types are passed in.