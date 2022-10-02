const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'A tour name must be unique'],
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    minlength: [10, 'A tour name must have more or equal than 10 characters'],
    // validate: [validator.isAlpha, 'tour name must only contains character']
  },
  ratings: {
    type: Number,
    default: 4.5,
    min: [1, 'must be greater than 1'],
    max: [5, 'must be less than 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        //this keyword is only gonna point to the document when we are creating a new document its not gonna work when we're updating a new document
        return val < this.price
      },
      //({VALUE}) will have access to val and that thing is related to mongoose not javascript
      message: 'discount price ({VALUE}) should be lower than regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    //converted to date stamp
    default: Date.now(),
    select: false
  },
  slug: String,
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  //we are saying each time the data is outputter as JSON we want virtuals to be part of the output
  //better than doing this in the controller
  //if we query the collection using .find({durationWeeks: value}) this wont work because its not an actual part of model 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

//Document Middleware
//this function will be called before a document is saved to the database "before .save() and .create()" but not on .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// tourSchema.pre('save', function (next) {
//   console.log('saving the document...');
//   next()
// })

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next()
// })

//Query Middleware

//All strings start with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next();
})

//we still have access to the query after the query is executed
//this.start is added to the query not to the data result

tourSchema.post(/^find/, function (doc, next) {
  console.log(Date.now() - this.start);
  next()
})

//Aggregate Middleware

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ '$match': { secretTour: { $ne: true } } })
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour