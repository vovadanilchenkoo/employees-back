const redis = require('redis')
const { jwtVerify } = require('../rootcommmon/jwt')
const { errorCodes, AppError, assert } = require('supra-core')

const redisClient = redis.createClient()

/**
 * @param {String} accessToken 
 * @return {Promise} true/Error
 */
function setTokenToBlacklist(accessToken) {
  jwtVerify(accessToken, process.env.SECRET)
    .then(tokenData => {
      // all dates get/set in secconds
      const tokenExpirationDate = tokenData.exp
      const currentTime = Math.round(Date.now() / 1000)
      const expireAt = tokenExpirationDate - currentTime

      redisClient.set(tokenData.userId, accessToken, 'EX', expireAt)
    }).catch(error => {
      return error
    })
}

/**
 * @param {String} accessToken
 * @param {String} userId
 * @return {Promise} true/Error
 */
async function isTokenBlacklisted(userId) {
  redisClient.get(userId, function(err, res) {
    if(res !== null) {
      throw new AppError({ 
        ...errorCodes.TOKEN_EXPIRED,
        message: 'Token expired'
      })
    }
  })
}

module.exports = { setTokenToBlacklist, isTokenBlacklisted }