// const router = require('../core/node_modules/express').Router()
const router = require('express').Router()

const actions = require('../actions/users')
const { BaseController } = require('./BaseController')
const logger = require('../logger')

class UsersController extends BaseController {
  get router () {
    router.post('/user/create', this.actionRunner(actions.CreateUserAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new UsersController()

