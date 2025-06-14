const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')


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
    trim: true
  },
  password:{
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    validate: [validator.isStrongPassword, 'Password not strong enough'],
    select: false
  },
  passwordConfirm:{
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(passwordConfirm){
        return passwordConfirm === this.password
      },
      message: 'Passwords are not the same'
    },
  }
})

// For encryption of data
userSchema.pre('save', async function(next){
  // this is to avoid rehashing a hashed password: only runs when 'password' has been modified
  if(!this.isModified('password')) return next()

  // hashes the password if the password field was modified
  this.password = await bcrypt.hash(this.password, 12)

  // gets rid of the passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

// instance function to check that the password is correct
userSchema.methods.correctPassword = async function(enteredPassword, hashedPassword){
  const correct = await bcrypt.compare(enteredPassword, hashedPassword)
  return correct
}

// Create user model from Schema
const User = mongoose.model('User', userSchema)

module.exports = User