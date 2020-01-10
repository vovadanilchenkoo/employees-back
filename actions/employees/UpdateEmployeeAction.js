const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
// const PostDAO = require('../../dao/PostDAO')
const EmployeeModel = require('../../models/EmployeeModel')

class UpdateEmployeeAction extends BaseAction {
  // static get accessTag () {
  //   return 'posts:update'
  // }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(EmployeeModel.schema.id, { required: true })
      },
      body: {
        title: new RequestRule(EmployeeModel.schema.title),
        content: new RequestRule(EmployeeModel.schema.content)
      },
      notEmptyBody: true
    }
  }

  static async run (req) {
    const { currentUser } = req

    // Make some db query
    // const model = await PostDAO.baseGetById(+req.params.id)
    // const data = await PostDAO.baseUpdate(+req.params.id, req.body)

    return this.result({ data })
  }
}

module.exports = UpdateEmployeeAction
