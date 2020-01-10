const BaseAction = require('../BaseAction')
// const PostDAO = require('../../dao/PostDAO')

class ListEmployeesAction extends BaseAction {
  // static get accessTag () {
  //   return 'posts:list'
  // }

  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams
      }
    }
  }

  static async run (req) {
    const { query } = req

    // Make some db query
    // const data = await PostDAO.baseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: { 'X-Total-Count': data.total }
    })
  }
}

module.exports = ListEmployeesAction
