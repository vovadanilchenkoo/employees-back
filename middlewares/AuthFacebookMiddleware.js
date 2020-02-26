const { errorCodes, BaseMiddleware } = require('supra-core')
const logger = require('../logger')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config()

class AuthFacebookMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      // config passport strategies
      passport.serializeUser((user, cb) => {
        cb(null, user)
      })

      passport.deserializeUser((user, cb) => {
        cb(null, user)
      })

      passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['email']
      },
        async function(accessToken, refreshToken, profile, cb) {
          // User.createOrFindSocialNetworkProfile must return jwt token
          const user = await User.createOrFindSocialNetworkProfile(profile, 'facebook') 
          if (typeof user === 'string') {
            cb(null, profile, user)
          } else {
            cb(null, profile)
          }
        }
      ))

      app.use(passport.initialize())

      next()
    }
  }
}

module.exports = new AuthFacebookMiddleware()