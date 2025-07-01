const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { promisify } = require('util')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

dotenv.config({ path: '../config.env' })

const signUser = id => jwt.sign({ id: id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN})

// SIGNING UP
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  // sign user in after signing up
  const token = signUser(newUser._id)

  // hide password from client
  newUser.password = undefined

  if(newUser){
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      token,
      data: {
        user: newUser
      }
    })
  }
})

// SIGNING IN
exports.signin = catchAsync(async (req, res, next) => {
  let token
  // 1. check for email and password, Mongoose model validation only works for creating documents hence does not help here
  const { email, password } = req.body
  if(!email || !password) throw new AppError("Please input an email and/or password", 401) // 401 - Unauthorized
  
  // 2. check if user exists on the db
  const user = await User.findOne({ email }).select('+password')

  if(!user || !await user.correctPassword(password, user.password)) throw new AppError("Incorrect email or password")

  // 3. if user exists check if password is correct
  token = signUser(user._id)

  // 4. sign user in
  res.status(200).json({
    status: 'success',
    message: 'Sign In Successful',
    token: token,
    data: {
      user
    }
  })
})


// Protect middleware
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token to know if user is signed in
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

  if(!token){
    throw new AppError('You are not logged in! Please log in and try again', 401) // 401 - Unauthorized
  }

  // 2. Validate/Verify token
  const decoded_payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log(decoded_payload)

  // 3. Check if user still exists...not clear yet
  const currentUser = await User.findById(decoded_payload.id)
  if(!currentUser){
    throw new AppError('The user belonging to this token does not exist', 401) // 401 - Unauthorized
  }

  // 4. Check if user changed password after token was issued....not clear yet
  if(currentUser.changedPasswordAfter(decoded_payload.iat)){
    throw new AppError('User recently changed password! Please log in again', 401) // 401 - Unauthorized
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

// Restrict access to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      throw new AppError('You do not have permission to perform this action', 403) // 403 - Forbidden
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({email: req.body.email})

  if(!user){
    return next(new AppError('There is no user with that email address', 404)) // 404 - Not Found
  }

  //2. Generate random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false }) // save the user with the reset token and expiration time
  
  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false }) // save the user without the reset token and expiration time

    console.error(err)
    
    return next(new AppError('There was an error sending the email. Try again later!', 500)) // 500 - Internal Server Error
  }

})

//
exports.resetPassword = catchAsync(async (req, res, next) => {
  
})