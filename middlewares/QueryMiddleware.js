const { BaseMiddleware, AppError, errorCodes } = require('supra-core')
const logger = require('../logger')

class QueryMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      try {
        // validate content-type
        const contentType = req.headers['Content-Type'] || req.headers['content-type']
        const validContentType = ['application/json', 'multipart/form-data']
        if(req.method !== 'GET' && req.method !== 'OPTIONS') {
          if (!contentType || !validContentType.includes(contentType)) {
            throw new AppError({ ...errorCodes.BAD_REQUEST, message: `Invalid content type. Expect one of: [${validContentType}]` })
          }
        }

        // get method default query
        req.query = req.method === 'GET' ? {
          ...req.query,
          page: Number(req.query.page) || 0,
          limit: Number(req.query.limit) || 10,
          filter: req.query.filter || {},
          orderBy: {
            ...((req.query.orderBy && req.query.orderBy.field && { field: req.query.orderBy.field }) || { field: 'createdAt' }),
            ...((req.query.orderBy && req.query.orderBy.direction && { direction: req.query.orderBy.direction }) || { direction: 'asc' })
          }
        } : { ...req.query }
        next()
      } catch (error) {
        next(error)
      }
    }
  }
}

module.exports = new QueryMiddleware()
