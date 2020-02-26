const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const EmployeeModel = require('../../models/EmployeeModel')

class RemoveEmployeeAction extends BaseAction {
  static get validationRules () {
    return {
      params: {
        id: new RequestRule(EmployeeModel.schema.id, { required: true })
      }
    }
  }

  static async run (ctx) {
    await EmployeeModel.remove(ctx.params.id, ctx.currentUser.id)

    return this.result({ message: `${ctx.params.id} was removed` })
  }
}

module.exports = RemoveEmployeeAction
