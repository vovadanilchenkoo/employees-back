"use strict";
const { assert } = require('supra-core');
const UserModel = require('../../../models/UserModel');
const SessionModel = require('../../../models/SessionModel');
const { SessionEntity } = require('./SessionEntity');
const MAX_SESSIONS_COUNT = 2;
async function addSession(session) {
    assert.instanceOf(session, SessionEntity);
    if (await _isValidSessionsCount(session.userId)) {
        await _addSession(session);
    }
    else {
        await _wipeAllUserSessions(session.userId);
        await _addSession(session);
    }
}
async function _isValidSessionsCount(userId) {
    assert.validate(userId, UserModel.schema.id, { required: true });
    const existingSessionsCount = await SessionModel.baseGetCount(userId);
    return existingSessionsCount <= MAX_SESSIONS_COUNT;
}
async function _addSession(session) {
    // for better performance store sessions in Redis persistence
    await SessionModel.baseCreate(session);
}
async function _wipeAllUserSessions(userId) {
    assert.validate(userId, UserModel.schema.id, { required: true });
    return await SessionModel.baseRemoveWhere({ table: 'sessions', column: 'userId', value: userId });
}
module.exports = { addSession };
