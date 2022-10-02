const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })
const app = require('./app')
const PORT = process.env.PORT || 3000
const DATABASE = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DATABASE)


//creates a listener on the specified port or path to listen to incoming requests
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT} in ${process.env.NODE_ENV} env`);
})