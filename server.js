// Import modules 
const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Configure dotenv to read ENV variables
dotenv.config({ path: './config.env' })

// Connect mongodb driver to database
mongoose.connect(process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD))
mongoose.connection.on('connected', () => {console.log('Connected to MongoDB Server')})

// Set up server to listen on port 8000
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}...`)
})