const router = require('../core/node_modules/express').Router()

const { passportInit } = require('../rootcommmon/oauth/strategiesConfig')
const { BaseController } = require('./BaseController')
const passport = require('passport')
const actions = require('../actions/auth')
const logger = require('../logger')

class AuthController extends BaseController {
  constructor() {
    super()
    passportInit()
  }

  get router () {
    router.post('/auth/sign-in', this.actionRunner(actions.LoginAction))
    router.post('/auth/logout', this.actionRunner(actions.LogoutAction))
    router.post('/auth/refresh-tokens', this.actionRunner(actions.RefreshTokensAction))
    // Facebook authentication
    router.get('/auth/facebook', (req, res, next) => {
      passport.authenticate('facebook', {scope: 'email', callbackURL: '/auth/facebook/callback', state: req.query.fingerprint})(req, res, next)
    })
    router.get('/auth/facebook/callback', (req, res, next) => {
      passport.authenticate('facebook', {callbackURL: '/auth/facebook/callback'})(req, res, next)
    }, this.actionRunner(actions.OauthCallbackAction))

    // Google authentication
    router.get('/auth/google', (req, res, next) => {
      passport.authenticate('google', {scope: 'email', callbackURL: `/auth/google/callback`, state: req.query.fingerprint})(req, res, next)
    })
    router.get('/auth/google/callback', (req, res, next) => {
      passport.authenticate('google', {callbackURL: `/auth/google/callback`})(req, res, next)
    }, this.actionRunner(actions.OauthCallbackAction))

    // Github authentication
    router.get('/auth/github', (req, res, next) => {
      passport.authenticate('github', {scope: 'email', state: req.query.fingerprint})(req, res, next)
    })
    router.get('/auth/github/callback', passport.authenticate('github'), this.actionRunner(actions.OauthCallbackAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new AuthController()
