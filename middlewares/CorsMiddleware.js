const { BaseMiddleware } = require('supra-core')
const logger = require('../logger')

class CorsMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      // res.header('Access-Control-Allow-Origin', '*')
      // res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,PUT,DELETE,OPTIONS')
      // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, authorization, Authorization, x-access-token')
      // res.header('Access-Control-Expose-Headers', 'X-Total-Count')
      next()
    }
  }
}

module.exports = new CorsMiddleware()
