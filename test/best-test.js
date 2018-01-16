const async = require('async');
const request = require('request');
const test = require('tape');
const App = require('../index.js');
const MockSessionsService = require('./mock-sessions-service.js');

const testOpts = {
    timeout: 500
};
const APP_URL = 'http://localhost:3000';
const SESSIONS_PORT = 4000;
const SESSIONS_URL = 'http://localhost:' + SESSIONS_PORT;

let middlemanApp;
let sessionsService;

test('start service', testOpts, function t(assert) {
    middlemanApp = new App({
        sessionsClientUrl: SESSIONS_URL
    });
    sessionsService = new MockSessionsService(SESSIONS_PORT);
    async.parallel([
        middlemanApp.start.bind(middlemanApp),
        sessionsService.start.bind(sessionsService)
    ], assert.end);
});

test('everything ok - 200', testOpts, function t(assert) {
    sessionsService.registerResp({
        statusCode: 200,
        numActiveSessions: 5
    });
    request(APP_URL, function onResp(err, resp, body) {
        assert.notOk(err);
        assert.equal(200, resp && resp.statusCode);
        assert.deepEqual(JSON.parse(body), {
            numActiveSessions: 5
        });
        assert.end();
    });
});

test('everything not ok - 500', testOpts, function t(assert) {
    sessionsService.registerResp({
        statusCode: 500
    });
    request(APP_URL, function onResp(err, resp, body) {
        assert.notOk(err);
        assert.equal(500, resp && resp.statusCode);
        assert.end();
    });
});

test('teardown', testOpts, function t(assert) {
    async.parallel([
        middlemanApp.shutdown.bind(middlemanApp),
        sessionsService.shutdown.bind(sessionsService)
    ], assert.end);
});
