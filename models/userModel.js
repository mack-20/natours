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
  },
  passwordChangedAt: {
    type: Date
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

// For setting the passwordChangedAt field
userSchema.pre('save', async function(next){
  if(!this.isModified('password') || this.isNew) return next()

  // sets the passwordChangedAt field to the current date
  this.passwordChangedAt = Date.now() - 1000 // subtracting 1000ms to ensure the JWT is not issued after the password change
  next()
})

// instance function to check that the password is correct
userSchema.methods.correctPassword = async function(enteredPassword, hashedPassword){
  const correct = await bcrypt.compare(enteredPassword, hashedPassword)
  return correct
}

// instance function to check if the password has been modified
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  // if the password was changed after the JWT was issued, then return true
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  // if the password was not changed after the JWT was issued, then return false
  return false
}

// Create user model from Schema
const User = mongoose.model('User', userSchema)

module.exports = User