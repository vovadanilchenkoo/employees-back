const InitsMiddleware = require('./InitMiddleware')
const CorsMiddleware = require('./CorsMiddleware')
const CheckAccessTokenMiddleware = require('./CheckAccessTokenMiddleware')
const SanitizeMiddleware = require('./SanitizeMiddleware')
const QueryMiddleware = require('./QueryMiddleware')
const AuthFacebookMiddleware = require('./AuthFacebookMiddleware')

module.exports = [
  InitsMiddleware,
  CorsMiddleware,
  CheckAccessTokenMiddleware,
  AuthFacebookMiddleware,
  SanitizeMiddleware,
  QueryMiddleware
]
