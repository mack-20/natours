const mongoose = require('mongoose')
const validator = require('validator')

// User Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Name is empty']
  },
  email:{
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Email address is required'],
    validate: [validator.isEmail, 'Please fill a valid email address']
  },
  photo:{
    type: String,
    unique: true,
    trim: true
  },
  password:{
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    validate: [validator.isStrongPassword, 'Password not strong enough']
  },
  passwordConfirm:{
    type: String,
    required: [true, 'Please confirm your password']
  }
})

// Create user model from Schema
const User = mongoose.model('User', userSchema)

module.exports = User