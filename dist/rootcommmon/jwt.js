"use strict";
const jwt = require('jsonwebtoken');
const { errorCodes, AppError, assert } = require('supra-core');
/**
 * @param {string} token
 * @param {string} SECRET
 * @return {Promise} true/Error
 */
function jwtVerify(token, SECRET) {
    assert.string(token, { notEmpty: true });
    assert.string(SECRET, { notEmpty: true });
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return reject(new AppError({ ...errorCodes.TOKEN_EXPIRED }));
                }
                return reject(new AppError({ ...errorCodes.TOKEN_VERIFY, message: error.message }));
            }
            return resolve(decoded);
        });
    });
}
/**
 * @param {string} id
 * @param {string} SECRET
 * @param {object} options
 * @return {Promise} string (token)
 */
function jwtSign(id, SECRET, options) {
    assert.string(id, { required: true });
    return new Promise((resolve, reject) => {
        jwt.sign({ userId: id }, SECRET, options, (error, token) => {
            if (error)
                return reject(new AppError({ ...errorCodes.TOKEN_NOT_SIGNED, message: error.message }));
            return resolve(token);
        });
    });
}
module.exports = { jwtVerify, jwtSign };
