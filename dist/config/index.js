"use strict";
const app = require('./app');
const knex = require('./knex');
const asyncConfigs = [
    app,
    knex
];
function rootInit() {
    return new Promise(async (resolve, reject) => {
        for (const config of asyncConfigs) {
            try {
                await config.init();
            }
            catch (e) {
                return reject(e);
            }
        }
        resolve();
    });
}
module.exports = {
    app,
    knex,
    rootInit
};
