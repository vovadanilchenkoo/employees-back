const router = require('express').Router()

const { BaseController } = require('./BaseController')
const actions = require('../actions/auth')
const logger = require('../logger')

class AuthController extends BaseController {
  get router () {
    router.post('/auth/sign-in', this.actionRunner(actions.LoginAction))
    router.post('/auth/sign-out', this.actionRunner(actions.LogoutAction))
    router.post('/auth/refresh-tokens', this.actionRunner(actions.RefreshTokensAction))
    router.get('/auth/facebook', this.actionRunner(actions.LoginFacebookAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new AuthController()
