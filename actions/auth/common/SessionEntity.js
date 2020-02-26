const { assert, AppError, errorCodes } = require('supra-core')
const ms = require('ms')
const moment = require('moment')
const uuidV4 = require('uuid/v4')
const UserModel = require('../../../models/UserModel')
const SessionModel = require('../../../models/SessionModel')
require('dotenv').config()

const expiredAtPeriodSec = ms(process.env.TOKEN_ACCESS_EXP)

class SessionEntity {
  constructor (src = {}) {
    console.log(src)
    assert.validate(src.user_id, UserModel.schema.id, { required: true })
    assert.validate(src.fingerprint, SessionModel.schema.fingerprint, { required: true })
    assert.validate(src.ip, SessionModel.schema.ip, { required: true })
    assert.validate(src.ua, SessionModel.schema.ua)
    if (src.expiredAt !== undefined && !Number(src.expiredAt)) {
      throw new AppError({ ...errorCodes.UNPROCESSABLE_ENTITY, message: 'Invalid expiredAt value' })
    }


    this.refreshToken = uuidV4()
    this.userId = src.user_id
    this.fingerprint = src.fingerprint
    this.ip = src.ip
    this.ua = src.ua || null
    this.expiredAt = Number(src.expiredAt) || new Date().getTime() + expiredAtPeriodSec
    this.updatedAt = moment(new Date())
    this.createdAt = moment(new Date())
  }
}

module.exports = { SessionEntity }
