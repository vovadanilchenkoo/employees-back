"use strict";
const RootController = require('./RootController');
const AuthController = require('./AuthController');
const EmployeesController = require('./EmployeesController');
const UsersController = require('./UsersController');
module.exports = [
    RootController,
    AuthController,
    EmployeesController,
    UsersController
];
