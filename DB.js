// Import modules 
const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./models/tourModel')

// Configure dotenv to read ENV variables
dotenv.config({ path: './config.env' })

// Read seeding data for DB synchronously
const tours = JSON.parse(fs.readFileSync('./dev-data/tours-simple.json', 'utf-8'))

// Connect mongodb driver to database
mongoose.connect(process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD))
mongoose.connection.on('connected', () => {console.log('Connected to MongoDB Server')})

// create a function to seed
const seedDB = async () => {
  try{
    await Tour.insertMany(tours)
    console.log('DB seeded successfully')
  }catch(error){
    console.log(`ERROR: ${error.message}`)
  }
}

// create a clear db function
const clearDB = async () => {
  try{
    const result = await Tour.deleteMany()
    console.log('DB cleared successfully. ', result.deletedCount, 'documents deleted')
  }catch(error){
    console.log(`ERROR: ${error.message}`)
  }
}

(
  async () => {
    if (process.argv[2] === '--seed'){
      await seedDB()
      process.exit(0)
    }
    else if(process.argv[2] === '--clear'){
      await clearDB()
      process.exit(0)
    }
    else{
      console.log("Please specify argument: node DB.js --seed or --clear")
      process.exit(1)
    }
  }
)()
