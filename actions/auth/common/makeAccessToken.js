const ms = require('ms')
const { assert } = require('supra-core')
const { jwtSign } = require('../../../rootcommmon/jwt')
require('dotenv').config()

/**
 * @param {string} id
 * @return {Promise} string
 */
function makeAccessToken (id) {
  assert.string(id, { required: true })

  const options = { expiresIn: process.env.TOKEN_ACCESS_EXP }
  const expireAt = (Date.now() / 1000) + (ms(process.env.TOKEN_ACCESS_EXP) / 1000)

  return {
    accessToken: jwtSign(id, process.env.SECRET, options),
    expireAt
  }
}

module.exports = { makeAccessToken }