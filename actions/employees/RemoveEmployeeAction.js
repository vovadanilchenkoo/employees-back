const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
// const PostDAO = require('../../dao/PostDAO')
const EmployeeModel = require('../../models/EmployeeModel')

class RemoveEmployeeAction extends BaseAction {
  // static get accessTag () {
  //   return 'posts:delete'
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
    // const model = await PostDAO.baseGetById(+req.params.id)
    // await PostDAO.baseRemove(+req.params.id)

    return this.result({ message: `${req.params.id} was removed` })
  }
}

module.exports = RemoveEmployeeAction
