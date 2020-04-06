const { errorCodes, BaseMiddleware } = require('supra-core')
const { jwtVerify } = require('../rootcommmon/jwt')
const { isTokenBlacklisted } = require('../rootcommmon/accessTokenBlacklist')
const logger = require('../logger')
require('dotenv').config()

class CheckAccessTokenMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      const token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization']

      // set default meta data
      req.user = Object.freeze({
        id: null,
        name: null,
        email: null,
        expiresIn: null
      })
      
      // if request on /auth routes move next else authorize request
      if (req.path.includes('/auth/') || req.path === '/favicon.ico' || req.path === '/user/create' || req.method === 'OPTIONS') {
        next()
      } else {
        return jwtVerify(token, process.env.SECRET)
        .then(tokenData => {
            // set actual current user
            const userId = tokenData.userId
            const expiresIn = Number(tokenData.exp)

            req.user = Object.freeze({
              id: userId,
              expiresIn: expiresIn
            })

            // check in redis if accessToken is "blacklisted"
            // isTokenBlacklisted(userId)
            isTokenBlacklisted(tokenData.jti)

            next()
          }).catch(error => {
            if (error.code === errorCodes.TOKEN_EXPIRED.code) {
              /**
               * pass request if token is not valid
               * in this case security service will consider that request as anonymous request
               */
              next()
            } else {
              next(error)
            }
          })
      }
    }
  }
}

module.exports = new CheckAccessTokenMiddleware()
