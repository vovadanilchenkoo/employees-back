const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserModel = require('../../models/UserModel')
const { makePasswordHash } = require('./common/makePasswordHash')
const logger = require('../../logger')

class CreateUserAction extends BaseAction {
  static get validationRules () {
    return {
      body: {
        id: new RequestRule(UserModel.schema.id),
        email: new RequestRule(UserModel.schema.email, { required: true }),
        password: new RequestRule(UserModel.schema.passwordHash, { required: true }),
        created_date: new RequestRule(UserModel.schema.created_date),
        modified_date: new RequestRule(UserModel.schema.modified_date)
      }
    }
  }

  static async run (ctx) {
    console.log('fldjrshljksjfdlkjkldjfslk')
    console.log('ctx param in user action', ctx)
    const hash = await makePasswordHash(ctx.body.password)
    delete ctx.body.password

    // Make some db query here
    UserModel.create(ctx, hash)
    // const user = await UserDAO.create({
    //   ...ctx.body,
    //   passwordHash: hash
    // })

    // await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    return this.result({ data: user })
  }
}

module.exports = CreateUserAction
