const { AppError } = require('./AppError')
const uuidV4 = require('uuid/v4')
const isUUID = require('validator/lib/isUUID')
const errorCodes = require('./errorCodes')
const { Rule } = require('./Rule')
const { Assert: assert } = require('./assert')
const PG = require('pg')
require('dotenv').config()

const genericSchema = {
  id: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  created_date: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 300,
    description: 'string; min 3; max 300 chars;'
  }),
  modified_date: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 300,
    description: 'string; min 3; max 300 chars;'
  })
}

class BaseModel {
  constructor (src) {
    const { schema } = this.constructor

    Object.keys(schema).forEach(propName => {
      const rule = schema[propName]
      if (!rule) return

      const { validator, description } = rule
      const value = src[propName]

      const validationResult = validator(value)
      if (typeof validationResult !== 'boolean') {
        throw new Error(`Invalid '${propName}' field validator. Please redefine it. Validator should return only boolean type.`)
      }

      if (!validationResult) {
        throw new AppError({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
      }
    })

    buildModelProps(src, this.constructor.schema, this)
  }

  static get schema () {
    throw new Error('Missing schema')
  }

  static get genericSchema () {
    return genericSchema
  }

  /**
   * DB Query
   * @param {string} text
   * @param {Array} params
   * @returns {object} object 
   */
  static dbQuery (text, params) {
    const pool = new PG.Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      // ssl: true
    })

    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  static async baseGetById (where = {}) {
    assert.id(where.id, { required: true })

    const sqlQuery = `SELECT * FROM ${where.table} WHERE id = $1`

    const data = await this.dbQuery(sqlQuery, [where.id])
    if (!data) throw this.errorEmptyResponse()
    return data
  }

  static async baseGetCount (filter) {
    assert.string(filter, { required: true })
    const sqlQuery = 'SELECT * FROM sessions WHERE user_id = $1'
    
    const result = await this.dbQuery(sqlQuery, [filter])
    if (!result.count) return 0
    return Number(result.count)
  }

  static baseCreate (entity = {}) {
    assert.object(entity, { required: true })

    /**
     * each entity that creates must to have creator id (userId)
     * except user entity
     */
    if (!entity.email && !entity.userId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: 'Please provide in action class \'userId\' field',
        layer: 'Model'
      })
    }
    const sqlQuery = 'INSERT INTO sessions(id, user_id, refresh_token, ua, fingerprint, ip, expires_in, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    const values = [
      uuidV4(),
      entity.userId,
      entity.refreshToken,
      entity.ua,
      entity.fingerprint,
      entity.ip,
      entity.expiredAt,
      entity.updatedAt,
      entity.createdAt
    ]

    return this.dbQuery(sqlQuery, values)
  }

  static async baseRemoveWhere (where = {}) {
    assert.object(where, { required: true })
    console.log(where)

    const sqlQuery = `DELETE FROM ${where.table} WHERE ${where.column} = $1`

    return await this.dbQuery(sqlQuery, [where.value])
  }
}

function buildModelProps (src, schema, context) {
  Object.keys(src).forEach(propName => {
    const rule = schema[propName]
    if (!rule) return

    const { validator, description } = rule

    Object.defineProperty(context, propName, {
      get: () => src[propName],
      set: value => {
        if (!validator(value)) {
          throw new AppError({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
        }
        src[propName] = value
      },
      enumerable: true,
      configurable: false
    })
  })

  return Object.freeze(context)
}

function isInt (int) {
  const tmpInt = Number(int)
  return !!(tmpInt && Number.isInteger(tmpInt) && tmpInt >= 1)
}

module.exports = { BaseModel }
