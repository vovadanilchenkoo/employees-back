const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const EmployeeModel = require('../../models/EmployeeModel')

class UpdateEmployeeAction extends BaseAction {
  static get validationRules () {
    return {
      params: {
        id: new RequestRule(EmployeeModel.schema.id, { required: true })
      },
      body: {
        name: new RequestRule(EmployeeModel.schema.name),
        position: new RequestRule(EmployeeModel.schema.position),
        salary: new RequestRule(EmployeeModel.schema.salary),
        start_working_at: new RequestRule(EmployeeModel.schema.start_working_at),
        work_days: new RequestRule(EmployeeModel.schema.work_days),
        out_days: new RequestRule(EmployeeModel.schema.out_days),
      },
      notEmptyBody: true
    }
  }

  static async run (ctx) {
    const result = await EmployeeModel.update(ctx)

    return this.result({ data: result })
  }
}

module.exports = UpdateEmployeeAction
