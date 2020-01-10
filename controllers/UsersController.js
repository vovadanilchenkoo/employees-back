const router = require('express').Router()

const actions = require('../actions/users')
const { BaseController } = require('./BaseController')
const logger = require('../logger')

class UsersController extends BaseController {
  get router () {

    router.post('/user/create', this.actionRunner(actions.CreateUserAction))
    router.post('/user/sign-in', this.actionRunner(actions.SignInUserAction))
    router.post('/user/logout', this.actionRunner(actions.LogoutUserAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new UsersController()

