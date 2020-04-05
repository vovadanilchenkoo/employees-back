const joi = require('@hapi/joi')
const moment = require('moment')
const uuidV4 = require('uuid/v4')
const isUUID = require('validator/lib/isUUID')
const { BaseModel, Rule } = require('supra-core')

// TODO: check all validation schemas and set right rules

const schema = {
  id: new Rule({
    validator: v => isUUID(v),
    description: 'uuid primary key value'
  }),
  name: new Rule({
    validator: v => typeof v === 'string' && v.length >= 2,
    description: 'string; min 2 chars'
  }),
  position: new Rule({
    validator: v => typeof v === 'string' && v.length >= 2,
    description: 'string; min 2 chars'
  }),
  salary: new Rule({
    validator: v => typeof v === 'string' && v.length >= 1,
    description: 'string; min 1 digit in string. String must contain just digits'
  }),
  start_working_at: new Rule({
    validator: v => {
      return typeof v === 'string' && v.length >= 10
    },
    description: 'string; must contain 10 characters, like in string, for example "20-10-2020"'
  }),
  work_days: new Rule({
    validator: v => typeof v === 'number' || (typeof v === 'string' && v.length >= 1),
    description: 'string; min 1 digit in string. String must contain just digits'
  }),
  out_days: new Rule({
    validator: v => typeof v === 'number' || (typeof v === 'string' && v.length >= 1),
    description: 'string; min 1 digit in string. String must contain just digits'
  }),
  owner_id: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  created_date: new Rule({
    validator: v => Number.isInteger(v),
    description: 'number;'
  }),
  modified_date: new Rule({
    validator: v => Number.isInteger(v),
    description: 'number;'
  })
}

class EmployeeModel extends BaseModel {
  static get schema () {
    return schema
  }

  static async create(data) {
    const sqlQuery = `INSERT INTO
      employees(id, name, position, salary, start_working_at, work_days, out_days, owner_id, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`
    const values = [
      uuidV4(),
      data.name,
      data.position,
      data.salary,
      data.start_working_at,
      data.work_days,
      data.out_days,
      data.id,
      moment(new Date()),
      moment(new Date())
    ]

    const { rows } = await this.dbQuery(sqlQuery, values)

    return rows
  }

  static async getAll(user_id) {
    const sqlQuery = 'SELECT * FROM employees where owner_id = $1'
    try {
      const { rows } = await this.dbQuery(sqlQuery, [user_id])
      return { rows }
    } catch(e) {
      return e
    }
  }

  static async remove(employee_id, user_id) {
    const sqlQuery = 'DELETE FROM employees WHERE id = $1 AND owner_id = $2'

    this.dbQuery(sqlQuery, [employee_id, user_id])
  }

  static async update(ctx) {
    const findOneQuery = 'SELECT * FROM employees WHERE id=$1 AND owner_id = $2';
    const updateOneQuery =`UPDATE employees
      SET name=$1, position=$2, salary=$3, start_working_at=$4, work_days=$5, out_days=$6, modified_date=$7
      WHERE id=$8 AND owner_id = $9 returning *`;
    try {
      const { rows } = await this.dbQuery(findOneQuery, [ctx.params.id, ctx.currentUser.id]);
      if(!rows[0]) {
        return 'Employee not found'
      }
      const values = [
        ctx.body.name || rows[0].name,
        ctx.body.position || rows[0].position,
        ctx.body.salary || rows[0].salary,
        ctx.body.start_working_at || rows[0].start_working_at,
        ctx.body.work_days || rows[0].work_days,
        ctx.body.out_days || rows[0].out_days,
        moment(new Date()),
        ctx.params.id,
        ctx.currentUser.id
      ];
      const response = await this.dbQuery(updateOneQuery, values);
      return 'Employee data was updated'
    } catch(err) {
      return err
    }
  }
}

module.exports = EmployeeModel
