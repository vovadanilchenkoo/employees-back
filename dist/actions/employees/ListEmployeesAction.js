"use strict";
const BaseAction = require('../BaseAction');
const EmployeeModel = require('../../models/EmployeeModel');
class ListEmployeesAction extends BaseAction {
    static get validationRules() {
        return {
            query: {
                ...this.baseQueryParams
            }
        };
    }
    /**
     * Run action
     * @param {object} ctx
     * @returns {object} data object
     */
    static async run(ctx) {
        const data = await EmployeeModel.getAll(ctx.currentUser.id);
        return this.result({ data: data.rows });
    }
}
module.exports = ListEmployeesAction;
