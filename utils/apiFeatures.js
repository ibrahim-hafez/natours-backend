class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(e => delete queryObj[e])

    //Advanced filitering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortQuery = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortQuery)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsQuery = this.queryString.fields.split(',').join(' ')
      // const fieldsQueryTwo = req.query.fields.replaceAll(',', ' ')
      this.query = this.query.select(fieldsQuery)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  paginate() {
    const page = +this.queryString.page
    const limit = +this.queryString.limit
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures