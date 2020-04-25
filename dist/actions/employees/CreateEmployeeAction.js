"use strict";
const { RequestRule } = require('supra-core');
const BaseAction = require('../BaseAction');
const EmployeeModel = require('../../models/EmployeeModel');
const { jwtVerify } = require('../../rootcommmon/jwt');
require('dotenv').config();
class CreateEmployeeAction extends BaseAction {
    static get validationRules() {
        return {
            body: {
                id: new RequestRule(EmployeeModel.schema.id, { required: false }),
                name: new RequestRule(EmployeeModel.schema.name, { required: true }),
                position: new RequestRule(EmployeeModel.schema.position, { required: true }),
                salary: new RequestRule(EmployeeModel.schema.salary, { required: true }),
                start_working_at: new RequestRule(EmployeeModel.schema.start_working_at, { required: true }),
                work_days: new RequestRule(EmployeeModel.schema.work_days, { required: true }),
                out_days: new RequestRule(EmployeeModel.schema.out_days, { required: true }),
                owner_id: new RequestRule(EmployeeModel.schema.owner_id, { required: false }),
                created_date: new RequestRule(EmployeeModel.schema.created_date, { required: false }),
                modified_date: new RequestRule(EmployeeModel.schema.modified_date, { required: false }),
            }
        };
    }
    /**
     * Run action
     * @param {object} ctx
     * @returns {object} data object
     */
    static async run(ctx) {
        const data = {
            ...ctx.body,
            id: ctx.currentUser.id
        };
        const employee = await EmployeeModel.create(data);
        return this.result({ data: employee });
    }
}
module.exports = CreateEmployeeAction;
