const redis = require('redis')
const { jwtVerify } = require('../rootcommmon/jwt')
const { errorCodes, AppError, assert } = require('supra-core')

const redisClient = redis.createClient()

/**
 * @param {string} accessToken 
 * @return {Promise} true/Error
 */
function setTokenToBlacklist(accessToken) {
  jwtVerify(accessToken, process.env.SECRET)
    .then(tokenData => {
      // all dates get/set in secconds
      const tokenExpirationDate = tokenData.exp
      const currentTime = Math.round(Date.now() / 1000)
      const expireAt = tokenExpirationDate - currentTime

      redisClient.set(tokenData.jti, accessToken, 'EX', expireAt)
    }).catch(error => {
      return error
    })
}

/**
 * @param {string} accessToken
 * @param {string} userId
 * @return {Promise} true/Error
 */
async function isTokenBlacklisted(user_id) {
  redisClient.get(user_id, function(err, res) {
    if(res !== null) {
      throw new AppError({ 
        ...errorCodes.TOKEN_EXPIRED,
        message: 'Token expired'
      })
    }
  })
}

module.exports = { setTokenToBlacklist, isTokenBlacklisted }