const joi = require('@hapi/joi')
const { BaseModel, Rule } = require('supra-core')

const schema = {
  id: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'uuid primary key value'
  }),
  name: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'string value'
  }),
  position: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'string value'
  }),
  salary: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number for money value'
  }),
  start_working_at: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'date value'
  }),
  work_days: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number value'
  }),
  out_days: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number value'
  }),
  owner_id: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number value'
  }),
  created_date: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'timestamp in milliseconds value'
  }),
  modified_date: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'timestamp in milliseconds value'
  })
}

class EmployeeModel extends BaseModel {
  static get schema () {
    return schema
  }

  async create(req, res) {
    const createQuery = `INSERT INTO
      employees(id, name, position, salary, start_working_at, work_days, out_days, owner_id, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;
    const values = [
      uuidv4(),
      req.body.name,
      req.body.position,
      req.body.salary,
      req.body.start_working_at,
      req.body.work_days,
      req.body.out_days,
      req.user.id,
      moment(new Date()),
      moment(new Date())
    ];
    
    const { rows } = await db.query(createQuery, values);
    return res.status(201).send({'message': `Employee with name ${rows[0].name} created`});
  }
}

module.exports = EmployeeModel
