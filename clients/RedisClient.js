const redis = require('redis')
const { assert } = require('supra-core')
const $ = Symbol('private scope')

const logger = require('../logger')

class RedisClient {
  constructor (options = {}) {
    assert.integer(options.port)
    assert.string(options.host)

    this[$] = {
      client: redis.createClient()
    }

    this[$].client.on('error', error => {
      throw new Error(`${this.constructor.name}, ${error}`)
    })

    this[$].client.on('connect', () => {
      logger.debug(`${this.constructor.name} connected...`)
    })
  }

  /**
   * ------------------------------
   * upload tokens (uuids)
   * upload tokens (uuids)
   * ------------------------------
   */

  setToken (userId, token) {
    assert.array(listOfUuids, { required: true })
    assert.integer(ttl)

    return new Promise((resolve, reject) => {
      this[$].client.set(`upload-token::${userId}`, true, 'EX', 3600, (error, reply) => {
        if (error) return reject(error)
      })

      resolve()
    })
  }

  getToken (userId) {
    // assert.uuid(uuid, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.get(`upload-token::${uuid}`, (error, reply) => {
        if (error) return reject(error)
        return resolve()
      })
    })
  }
}

module.exports = RedisClient
