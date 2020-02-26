const { RedisClient } = require('../clients')
const config = require('../config')
const logger = require('../logger')

class RootProvider {
  constructor () {
    this.redisClient = new RedisClient()
  }
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
