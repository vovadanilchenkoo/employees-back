"use strict";
const bcrypt = require('bcryptjs');
const { errorCodes, AppError, assert } = require('supra-core');
/**
 * @description make from req.body.password hash and compare it with existing password hash
 * @param {strig} hash
 * @param {string} password
 * @return {Promise} true/Error
 */
function checkPassword(hash, password) {
    assert.string(hash, { notEmpty: true });
    assert.string(password, { notEmpty: true });
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error)
                return reject(new AppError(error));
            if (!result)
                return reject(new AppError({ ...errorCodes.INVALID_PASSWORD }));
            return resolve(result);
        });
    });
}
module.exports = { checkPassword };
