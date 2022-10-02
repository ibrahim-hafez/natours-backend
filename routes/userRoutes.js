const express = require('express')
const { getAllUsers, addUser, getUser, deleteUser } = require('../controller/userController')
const router = express.Router()

//User Routes
router
  .route('/')
  .get(getAllUsers)
  .post(addUser)
router
  .route('/:id')
  .get(getUser)
  .delete(deleteUser)

module.exports = router