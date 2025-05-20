// Import modules 
const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Configure dotenv to read ENV variables
dotenv.config({ path: './config.env' })

// Connect mongodb driver to database
mongoose.connect(process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD))
  .then(() => {console.log('Connection Successful')})
  .catch((err) => {console.error(`ERROR: ${err}`)})

mongoose.connection.on('connected', () => {console.log('Connected to MongoDB Server')})

// Set up server to listen on port 8000
const server = app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}...`)
})

// handling unhandled promise rejections || safety net
process.on('unhandledRejection', (err) => {
  console.error(`ERROR: ${err}`)
  console.log('Unhandled Exception. Exiting...')
  server.close(() => {
    process.exit(1)
  })
})