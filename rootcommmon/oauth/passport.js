const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const { makeAccessToken } = require('../../actions/auth/common/makeAccessToken')

async function finishCallback(req, res) {
  await makeAccessToken()
  res.redirect('http://localhost:3000/employees-table')
}

function facebook(req, res) {
  passport.authenticate('facebook', {scope: 'email'})
}

module.exports = {
  facebook
}