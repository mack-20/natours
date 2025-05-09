module.exports = (error, req, res, next) => { 
  // This is done to ensure that if err.status is not set, we have a default state for it. same applies to err.statusCode
  // This is helps standardize error responses
  error.status = error.status || 'error'
  error.statusCode = error.statusCode || 500

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  })
  next()
}