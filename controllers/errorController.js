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
    if (error instanceof AppError) {
      if(error.isOperational) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message
        })
      }
      else{
        // programming or unknown error, don't leak details to client
        console.error('ERROR 💥', error)
        return res.status(500).json({
          status: 'error',
          message: 'Something went wrong!'
        })
      }
    }
    else{
      // programming or unknown error, don't leak details to client
      console.error('ERROR 💥', error)
      return res.status(500).json({
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
    const errors = Object.values(error.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
  }

  const handleDuplicateFieldErrorDB = (error) => {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];

    const message = `Duplicate field value: ${value} already exists. Please use another ${field}!`;
    return new AppError(message, 400);
  }

  const handleJWTErrorDB = () => new AppError('Invalid token. Please log in again!', 401)

  const handleTokenExpiredErrorDB = () => new AppError('Your token has expired! Please log in again.', 401)

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
    if(error.code === 11000) finalError = handleDuplicateFieldErrorDB(error)

    // Hnalde JsonWebTokenError
    if(error.name === 'JsonWebTokenError') finalError = handleJWTErrorDB()

    // Handle TokenExpiredError
    if (error.name === 'TokenExpiredError') finalError = handleTokenExpiredErrorDB()

    sendErrorProd(finalError, res)
  }
  next()
}

// Errors we need to mark as operational
// 1. duplicate key : Occurs on unique index violation (e.g. duplicate email).
// 2. Validation errors: Occurs when data doesn't match the schema.
// 3. CastError: Occurs when invalid ObjectIds or wrong data types are passed in.
// 4. JWT errors: Occurs when the token is invalid or expired.