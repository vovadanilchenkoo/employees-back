const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
// const PostDAO = require('../../dao/PostDAO')
const EmployeeModel = require('../../models/EmployeeModel')

class GetEmployeeByIdAction extends BaseAction {
  // static get accessTag () {
  //   return 'posts:get-by-id'
  // }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(EmployeeModel.schema.id, { required: true })
      }
    }
  }

  static async run (req) {
    const { currentUser } = req

    // Make some db query
    // const model = await PostDAO.baseGetById(req.params.id)

    return this.result({ data: model })
  }
}

module.exports = GetEmployeeByIdAction
