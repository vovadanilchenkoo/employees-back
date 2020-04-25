"use strict";
const BaseAction = require('../BaseAction');
const { SessionEntity } = require('./common/SessionEntity');
const { makeAccessToken } = require('./common/makeAccessToken');
const { addSession } = require('./common/addSession');
class OauthCallbackAction extends BaseAction {
    static get validationRules() {
        return {};
    }
    /**
     * Run action
     * @param {object} ctx
     * @returns {object} data object
     */
    static async run(ctx) {
        const newSession = new SessionEntity({
            user_id: ctx.authInfo[0].id,
            ip: ctx.ip,
            ua: ctx.headers['User-Agent'],
            fingerprint: ctx.query.state
        });
        await addSession(newSession);
        const responseData = {
            accessToken: await makeAccessToken(ctx.authInfo[0].id).accessToken,
            refreshToken: newSession.refreshToken,
            expireAt: makeAccessToken(ctx.authInfo[0].id).expireAt
        };
        return this.redirect({
            url: `https://postgres-crud.herokuapp.com/sign-in?accessToken=${responseData.accessToken}&refreshToken=${responseData.refreshToken}&expireAt=${responseData.expireAt}`
        });
    }
}
module.exports = OauthCallbackAction;
