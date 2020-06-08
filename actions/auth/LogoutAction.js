const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const SessionModel = require('../../models/SessionModel')
const { setTokenToBlacklist } = require('../../rootcommmon/accessTokenBlacklist')
const { jwtVerify } = require('../../rootcommmon/jwt')
require('dotenv').config()

/**
 * remove current session
 */
class LogoutAction extends BaseAction { 
  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams
      }
    }
  }

  /**
   * Run action
   * @param {object} ctx
   * @returns {object} data object
   */
  static async run (ctx) {
    let userId
    await jwtVerify(ctx.headers.Token, process.env.SECRET)
      .then(tokenData => {
        userId = tokenData.userId
      })
      .catch(err => {
        next(err)
      })
    
    await SessionModel.baseRemoveWhere({ table: 'sessions', column: 'user_id', value: userId })
    // invaldate accessToken, set this token to redis "blacklist"
    setTokenToBlacklist(ctx.body.accessToken)

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = LogoutAction