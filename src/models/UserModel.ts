const isEmail = require('validator/lib/isEmail')
const isUUID = require('validator/lib/isUUID')
const uuidv4 = require('uuid/v4.js')
const moment = require('moment')
const { BaseModel, Rule } = require('supra-core')

const schema = {
  ...BaseModel.genericSchema,

  email: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
  }),
  password: new Rule({
    validator: v => typeof v === 'string' && v.length >= 1,
    description: 'string or number; min 1 symbol;'
  })
}

class UserModel extends BaseModel {
  static get schema () {
    return schema
  }

  /**
   * Create A User
   * @param {object} ctx(request object)
   * @returns {object} employee object 
   */
  static async create (data, hash) {
    const sqlQuery = `INSERT INTO
      users(id, email, password, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    let values
    if(data.emails) {
      values = [
        uuidv4(),
        data.emails[0].value,
        hash,
        moment(new Date()),
        moment(new Date())
      ]
    } else {
      values = [
        uuidv4(),
        data.body.email,
        hash,
        moment(new Date()),
        moment(new Date())
      ]
    }

    try {
      const { rows } = await this.dbQuery(sqlQuery, values)
     
      return rows
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return 'User with that EMAIL already exist'
      }
      return error;
    }
  }

  static async createOrFindUser (profile) {
    const findQuery = 'SELECT * from users WHERE email = $1'
    const foundUser = await this.dbQuery(findQuery, [profile.emails[0].value])

    if(!foundUser.rows[0]) {
      return await this.create(profile, '')
    } else {
      return foundUser.rows
    }
  }
}

module.exports = UserModel
