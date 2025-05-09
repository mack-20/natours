class AppError extends Error{
  // define constructor
  constructor(message, statusCode){
    super(message) // set the message prop with the Error super class constructor

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true // so that we only send errors for the operational errors back to the client ??

    // stack trace ???
    // we do not want to pollute the stack trace with this our function
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError