"use strict";
const { RequestRule } = require('supra-core');
const BaseAction = require('../BaseAction');
const EmployeeModel = require('../../models/EmployeeModel');
class GetEmployeeByIdAction extends BaseAction {
    static get validationRules() {
        return {
            params: {
                id: new RequestRule(EmployeeModel.schema.id, { required: true })
            }
        };
    }
    /**
     * Run action
     * @param {object} ctx
     * @returns {object} data object
     */
    static async run(ctx) {
        const data = await EmployeeModel.baseGetById({ table: 'employees', id: ctx.params.id });
        return this.result({ data: { ...data.rows[0] } });
    }
}
module.exports = GetEmployeeByIdAction;
