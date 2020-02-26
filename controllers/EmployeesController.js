const router = require('express').Router()

const actions = require('../actions/employees')
const { BaseController } = require('./BaseController')
const logger = require('../logger')

class EmployeesController extends BaseController {
  get router () {
    router.post('/employees/create', this.actionRunner(actions.CreateEmployeeAction))
    router.get('/employees/list', this.actionRunner(actions.ListEmployeesAction))
    router.get('/employee/:id', this.actionRunner(actions.GetEmployeeByIdAction))
    router.put('/employee/:id', this.actionRunner(actions.UpdateEmployeeAction))
    router.delete('/employee/:id', this.actionRunner(actions.RemoveEmployeeAction))

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new EmployeesController()
