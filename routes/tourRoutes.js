const express = require('express')
const { getTourStats, aliasTopTours, getAllTours, addTour, getTour, updateTour, deleteTour, getMonthlyPlan } = require('../controller/tourController')
const router = express.Router()

router
  .route('/tour-stats').get(getTourStats)
router
  .route('/monthly-plan/:year').get(getMonthlyPlan)

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

router
  .route('/')
  .get(getAllTours)
  .post(addTour)

router
  .route('/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour)

module.exports = router