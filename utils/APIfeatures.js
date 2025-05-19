const qs = require('qs')
const Tour = require("../models/tourModel")

class APIfeatures{
  constructor(mongoQuery, clientQuery){
    this.mongoQuery = mongoQuery
    this.clientQuery = clientQuery
  }

  filter(){
    let queryObj = {...this.clientQuery}
    // Extract special query parameters
    const excludedFields = ['page', 'sort', 'limit', 'fields'] // special fields to be excluded
    excludedFields.forEach(field => delete queryObj[field]) // excludes fields, 'delete' mutates object directly

    // 1. Advanced Filtering
    let queryStr = JSON.stringify(qs.parse(queryObj))
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    queryObj = JSON.parse(queryStr)

    this.mongoQuery.find(queryObj)

    return this
  }

  sort(){
    // 2. Sorting
    if (this.clientQuery.sort){
      const sort = this.clientQuery.sort.split(',').join(' ')
      this.mongoQuery.sort(sort)
    }
    else{
      this.mongoQuery.sort('_id')
    }

    return this
  }

  
  limitFields(){
    // 3. Field Limiting
    if (this.clientQuery.fields){
      const fields = this.clientQuery.fields.split(',').join(' ')
      this.mongoQuery.select(fields)
    }
    else{
      this.mongoQuery.select('-__v')
    }
    
    return this
  }
  
  async paginate(){
    // 3. Pagination
    let pagination = {
      total_records: await this.mongoQuery.clone().countDocuments(),
      current_page: NaN,
      records_per_page: NaN,
      next_page: NaN,
      prev_page: NaN
    }

    if (this.clientQuery.page || this.clientQuery.limit){
      const page = this.clientQuery.page * 1 || 1
      const limit = this.clientQuery.limit * 1 || 5
      
      const skip = limit * (page - 1)

      this.mongoQuery.skip(skip).limit(limit)

      // set pagination data
      pagination.current_page = page
      pagination.next_page = (page + 1) * skip <= pagination.total_records ? page + 1 : null
      pagination.prev_page = page - 1 > 0 ? page - 1 : null
      pagination.records_per_page = limit

    }
    else{
      // limit data being sent to client
      this.mongoQuery.limit(50)
    }

    return {query: this.mongoQuery, pagination}
  }
}

module.exports = APIfeatures