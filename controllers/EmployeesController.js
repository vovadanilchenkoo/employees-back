const router = require('express').Router()

const actions = require('../actions/employees')
const { BaseController } = require('./BaseController')
const logger = require('../logger')

class EmployeesController extends BaseController {
  get router () {
    router.param('id', prepareEmployeeId)

    router.post('/create-employee', this.actionRunner(actions.CreateEmployeeAction))
    router.get('/employees-list', this.actionRunner(actions.ListEmployeesAction))
    router.get('/employee/:id', this.actionRunner(actions.GetEmployeeByIdAction))
    router.put('/employee/:id', this.actionRunner(actions.UpdateEmployeeAction))
    router.delete('/employee/:id', this.actionRunner(actions.RemoveEmployeeAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

function prepareEmployeeId (req, res, next) {
  const id = Number(req.params.id)
  if (id) req.params.id = id
  next()
}

module.exports = new EmployeesController()
