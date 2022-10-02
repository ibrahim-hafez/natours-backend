const express = require('express')
const morgan = require('morgan')

const app = express()
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')
//middleware is just a function that can modify the incoming request data
app.use(express.json())
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)



module.exports = app