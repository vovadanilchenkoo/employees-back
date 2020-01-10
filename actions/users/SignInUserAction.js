const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserModel = require('../../models/UserModel')
const { makePasswordHash } = require('./common/makePasswordHash')
const logger = require('../../logger')

class SignInUserAction extends BaseAction {

  static get validationRules () {
    return {
      body: {
        name: new RequestRule(UserModel.schema.name, { required: true }),
        username: new RequestRule(UserModel.schema.username, { required: true }),
        email: new RequestRule(UserModel.schema.email, { required: true }),
        location: new RequestRule(UserModel.schema.location),
        password: new RequestRule(UserModel.schema.passwordHash, { required: true })
      }
    }
  }

  static async run (ctx) {
    const hash = await makePasswordHash(ctx.body.password)
    delete ctx.body.password

    // Make some db query here
    // const user = await UserDAO.create({
    //   ...ctx.body,
    //   passwordHash: hash
    // })

    // await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    return this.result({ data: user })
  }
}

module.exports = SignInUserAction
