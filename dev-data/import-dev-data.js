const fs = require('fs')
const Tour = require('../models/tourModel')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DATABASE = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DATABASE).then(() => console.log('Database connection successful!'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Database loaded successfuly!');
  } catch (err) {
    console.error(err);
  }
  process.exit()
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Database deleted successfuly!');
  } catch (err) {
    console.error(err);
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
