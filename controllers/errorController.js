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

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(error, res)
  }
  else if (process.env.NODE_ENV === 'production'){
    sendErrorProd(error, res)
  }


  next()
}