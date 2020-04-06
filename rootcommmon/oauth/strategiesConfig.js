const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github').Strategy
const UserModel = require('../../models/UserModel')
require('dotenv').config()

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const FACEBOOK_CONFIG = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email'],
  passReqToCallback: true
}
const GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  profileFields: ['email'],
  passReqToCallback: true
}
const GITHUB_CONFIG = {
  clientID: process.env.GITHUB_APP_ID,
  clientSecret: process.env.GITHUB_APP_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  profileFields: ['email'],
  passReqToCallback: true
}

const verifyCallback = async (req, accessToken, refreshToken, profile, cb) => {
  const user = await UserModel.createOrFindUser(profile)
  cb(null, profile, user)
}

function passportInit() {
  passport.use(new FacebookStrategy(FACEBOOK_CONFIG, verifyCallback))
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, verifyCallback))
  passport.use(new GitHubStrategy(GITHUB_CONFIG, verifyCallback))
}

module.exports = { passportInit }