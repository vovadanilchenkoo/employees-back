const { RequestRule, AppError, errorCodes } = require('supra-core')
const BaseAction = require('../BaseAction')
const AuthModel = require('../../models/AuthModel')
const { SessionEntity } = require('./common/SessionEntity')
const { makeAccessToken } = require('./common/makeAccessToken')
const { checkPassword } = require('../../rootcommmon/checkPassword')
const { addSession } = require('./common/addSession')

class LoginAction extends BaseAction {
  static get validationRules () {
    return {
      body: {
        password: new RequestRule(AuthModel.schema.password, { required: true }),
        email: new RequestRule(AuthModel.schema.email, { required: true }),
        fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true })
      }
    }
  }

  static async run (ctx) {
    if (!ctx.body.email || !ctx.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    let user = {}

    try {
      user = await AuthModel.getUserByEmail(ctx.body.email)
      await checkPassword(user[0].password, ctx.body.password)
    } catch (e) {
      if ([errorCodes.NOT_FOUND.code, errorCodes.INVALID_PASSWORD.code].includes(e.code)) {
        throw new AppError({ ...errorCodes.INVALID_CREDENTIALS })
      }
      throw e
    }

    const newSession = new SessionEntity({
      user_id: user[0].id,
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

module.exports = LoginAction