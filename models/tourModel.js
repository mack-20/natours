// Import modules
const mongoose = require('mongoose')

// Create tour schema
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have group size']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'difficult']
  },
  ratingsAverage: {
    type: Number,
    min: [0, 'Cannot give a rating less than zero.'],
    max: [5, 'Cannot give a rating above five.'],
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    required: [true, 'Quantity of ratings is required']
  },
  price: {
    type: Number,
    required: [true, 'Tour must have  price.']
  },
  summary: {
    type: String,
    trim: true,
    minLength: [20, 'Tour summary should be at least 20 characters long'],
    required: [true, 'Tour summar is required']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Tour description is required'],
    minLength: [125, 'Tour description should be at least 125 characters long']
  },
  imageCover: String,
  images: [String],
  startDates: [Date]
})

// Create tour model from schema
const Tour = mongoose.model('Tour', tourSchema)


// export tour model for external use
module.exports = Tour