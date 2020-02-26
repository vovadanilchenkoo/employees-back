const isEmail = require('validator/lib/isEmail')
const isUUID = require('validator/lib/isUUID')
const { BaseModel, Rule } = require('supra-core')

const schema = {
  email: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
  }),
  password: new Rule({
    validator: v => typeof v === 'string' && v.length >= 2,
    description: 'string; min 3 chars;'
  }),
  fingerprint: new Rule({ // https://github.com/Valve/fingerprintjs2
    validator: v => (typeof v === 'string') && v.length >= 10 && v.length <= 50,
    description: 'string; min 10; max 50 chars;'
  }),
  accessToken: new Rule({
    validator: v => typeof v === 'string' && v.length >= 8,
    description: 'string; min 8 chars'
  }),
  refreshToken: new Rule({
    validator: v => isUUID(v),
    description: 'string; UUID;'
  })
}

class AuthModel extends BaseModel {
  static get schema () {
    return schema
  }

  static async getUserByEmail (email) {
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await this.dbQuery(text, [email]);
      
      return rows
    } catch (e) {
      return e
    }
  }
}

module.exports = AuthModel
