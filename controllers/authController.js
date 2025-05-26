const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({ path: '../config.env' })

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  // sign user in after signing up
  const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, 
    {expiresIn: process.env.JWT_EXPIRES_IN}
  )

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