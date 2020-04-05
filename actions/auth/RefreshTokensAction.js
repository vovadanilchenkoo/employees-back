const { RequestRule } = require('supra-core')
const { SessionEntity } = require('./common/SessionEntity')
const { addSession } = require('./common/addSession')
const { verifySession } = require('./common/verifySession')
const { makeAccessToken } = require('./common/makeAccessToken')
const BaseAction = require('../BaseAction')
const AuthModel = require('../../models/AuthModel')
const SessionModel = require('../../models/SessionModel')

class RefreshTokensAction extends BaseAction {
  static get validationRules () {
    return {
      body: {
        accessToken: new RequestRule(AuthModel.schema.accessToken, { required: true }),
        refreshToken: new RequestRule(AuthModel.schema.refreshToken, { required: true }),
        fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true })
      }
    }
  }

  /**
   * Run action
   * @param {object} ctx
   * @returns {object} data object
   */
  static async run (ctx) {
    const reqRefreshToken = ctx.body.refreshToken
    const reqFingerprint = ctx.body.fingerprint
    
    const oldSession = await SessionModel.getByRefreshToken(reqRefreshToken)
    await SessionModel.baseRemoveWhere({ table: 'sessions', column: 'user_id', value: oldSession.rows[0].user_id })
    await verifySession(new SessionEntity(oldSession.rows[0]), reqFingerprint)
    const newSession = new SessionEntity({
      user_id: oldSession.rows[0].user_id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint
    })

    await addSession(newSession)

    return this.result({
      data: {
        accessToken: await makeAccessToken(oldSession.rows[0].user_id).accessToken,
        refreshToken: newSession.refreshToken,
        expireAt: makeAccessToken(oldSession.rows[0].user_id).expireAt
      }
    })
  }
}

module.exports = RefreshTokensAction