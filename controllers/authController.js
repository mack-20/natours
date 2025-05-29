const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const AppError = require('../utils/appError')

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
  if(!email || !password) throw new AppError("Please input an email and/or password", 401)
  
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