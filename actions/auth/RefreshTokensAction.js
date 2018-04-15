const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { cryptoDecryptService, parseTokenService, jwtService, makeAccessTokenService, makeRefreshTokenService } = require('../../services/auth')
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

const SECRET = require('../../config/token').refresh

class RefreshTokensAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        refreshToken: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let refreshToken = req.body['refreshToken']
    let refreshTokenIv = refreshToken.split('::')[0]
    let decodedRefreshToken = ''
    let parsedRefreshTokenData = {}

    let userEntity = {}
    let responseData = { accessToken: '', refreshToken: '', expiresIn: 0 }

    this.validate(req, this.validationRules)
      .then(() => cryptoDecryptService(refreshToken)) // decode refresh token taken from request
      .then(decodedRefToken => {
        decodedRefreshToken = decodedRefToken
        return parseTokenService(decodedRefToken) // parse refresh token data (taken from request)
      })
      .then(refreshTokenData => {
        parsedRefreshTokenData = refreshTokenData
        return UserDAO.GET_BY_ID(+refreshTokenData.sub) // get user entity from DB
      })
      .then(user => (userEntity = user))
      .then(() => UserDAO.GetRefreshToken(+parsedRefreshTokenData.sub, refreshTokenIv)) // get refresh token from DB by userId and refreshTokenIv
      .then(refreshTokenFromDB => {
        if (refreshTokenFromDB === refreshToken) { // compare refresh token from DB and refresh token from request
          return jwtService.verify(decodedRefreshToken, SECRET) // verify refresh token
            .catch(error => {
              UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenIv) // if not valid >> remove old refresh token
              throw error
            })
        }
        throw new ErrorWrapper({ ...errorCodes.BAD_REFRESH_TOKEN })
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        responseData.accessToken = accessTokenObj.accessToken
        responseData.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenIv)) // remove old refresh token
      .then(() => makeRefreshTokenService(userEntity)) // make new refresh token
      .tap(newRefreshToken => {
        let iv = newRefreshToken.split('::')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity.id, { iv, refreshToken: newRefreshToken }) // store new refresh token to DB
      })
      .then(newRefreshToken => (responseData.refreshToken = newRefreshToken))
      .then(() => res.json({ data: responseData, success: true }))
      .catch(error => next(error))
  }
}

module.exports = RefreshTokensAction