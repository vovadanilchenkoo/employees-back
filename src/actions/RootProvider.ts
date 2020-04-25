const { RedisClient } = require('../clients')
const logger = require('../logger')
require('dotenv').config()

class RootProvider {
  constructor () {
    // this.redisClient = new RedisClient({
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    //   user: process.env.REDIS_USER,
    //   password: process.env.REDIS_PASSWORD
    // })
  }
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
