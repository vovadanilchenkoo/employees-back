const BaseAction = require('../BaseAction')
const EmployeeModel = require('../../models/EmployeeModel')

class ListEmployeesAction extends BaseAction {
  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams
      }
    }
  }

  static async run (ctx) {
    const data = await EmployeeModel.getAll(ctx.currentUser.id)

    return this.result({ data: data.rows })
  }
}

module.exports = ListEmployeesAction
