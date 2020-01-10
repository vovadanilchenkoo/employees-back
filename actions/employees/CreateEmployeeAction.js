const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const EmployeeModel = require('../../models/EmployeeModel')

class CreateEmployeeAction extends BaseAction {

  static get validationRules () {
    return {
      body: {
        id: new RequestRule(EmployeeModel.schema.id, { required: true }),
        name: new RequestRule(EmployeeModel.schema.name, { required: true }),
        position: new RequestRule(EmployeeModel.schema.position, { required: true }),
        salary: new RequestRule(EmployeeModel.schema.salary, { required: true }),
        start_working_at: new RequestRule(EmployeeModel.schema.start_working_at, { required: true }),
        work_days: new RequestRule(EmployeeModel.schema.work_days, { required: true }),
        out_days: new RequestRule(EmployeeModel.schema.out_days, { required: true }),
        owner_id: new RequestRule(EmployeeModel.schema.owner_id, { required: true }),
        created_date: new RequestRule(EmployeeModel.schema.created_date, { required: true }),
        modified_date: new RequestRule(EmployeeModel.schema.modified_date, { required: true }),
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx

    // Make some db query
    // const data = await PostDAO.baseCreate({ ...ctx.body, userId: currentUser.id })
    const data = await EmployeeModel.create(ctx.body)

    return this.result({ data })
  }
}

module.exports = CreateEmployeeAction
