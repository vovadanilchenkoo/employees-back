const isUUID = require('validator/lib/isUUID')
const isIP = require('validator/lib/isIP')
const { BaseModel, Rule, assert } = require('supra-core')
const UserModel = require('./UserModel')

const schema = {
  ...BaseModel.genericSchema,

  userId: UserModel.schema.id,
  refreshToken: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  ua: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  fingerprint: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  ip: new Rule({
    validator: v => isIP(v),
    description: 'string; IP;'
  }),
  expiredAt: new Rule({
    validator: v => Number.isInteger(v),
    description: 'number;'
  })
}

class SessionModel extends BaseModel {
  static get schema () {
    return schema
  }

  static async getByRefreshToken (refreshToken) {
    assert.string(refreshToken, { notEmpty: true })

    const sqlQuery = 'SELECT * from sessions WHERE refresh_token = $1'

    const result = await this.dbQuery(sqlQuery, [refreshToken])
    if (!result) throw this.errorEmptyResponse()
    return result
  }
}

module.exports = SessionModel