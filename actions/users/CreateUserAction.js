const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserModel = require('../../models/UserModel')
const SessionModel = require('../../models/SessionModel')
const { makePasswordHash } = require('./common/makePasswordHash')
const { SessionEntity } = require('../auth/common/SessionEntity')
const { addSession } = require('../auth/common/addSession')
const { makeAccessToken } = require('../auth/common/makeAccessToken')
const logger = require('../../logger')

class CreateUserAction extends BaseAction {
  static get validationRules () {
    return {
      body: {
        id: new RequestRule(UserModel.schema.id),
        email: new RequestRule(UserModel.schema.email, { required: true }),
        password: new RequestRule(UserModel.schema.password, { required: true }),
        fingerprint: new RequestRule(SessionModel.schema.fingerprint, { required: true }),
        created_date: new RequestRule(UserModel.schema.created_date),
        modified_date: new RequestRule(UserModel.schema.modified_date)
      }
    }
  }

  /**
   * Run action
   * @param {object} ctx
   * @returns {object} data
   */
  static async run (ctx) {
    const hash = await makePasswordHash(ctx.body.password)
    delete ctx.body.password

    const user = await UserModel.create(ctx, hash)

    const newSession = new SessionEntity({
      userId: user[0].id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint
    })
    await addSession(newSession)
    
    return this.result({ 
      data: {
        accessToken: await makeAccessToken(user[0].id).accessToken,
        refreshToken: newSession.refreshToken,
        expireAt: makeAccessToken(user[0].id).expireAt
      }
    })
  }
}

module.exports = CreateUserAction
