const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const AuthModel = require('../../models/AuthModel')
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
      body: {
        accessToken: new RequestRule(AuthModel.schema.accessToken, { required: true })
      }
    }
  }

  static async run (ctx) {
    let userId
    jwtVerify(ctx.body.accessToken, process.env.SECRET)
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