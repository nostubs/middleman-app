const request = require('request');
const test = require('tape');
const App = require('../index.js');
const MockSessionsClient = require('./mock-sessions-client.js');

const testOpts = {
    timeout: 500
};
const APP_URL = 'http://localhost:3000';

let middlemanApp;
let mockSessionsClient;

test('start service', testOpts, function t(assert) {
    middlemanApp = new App({
        sessionsClientUrl: 'http://www.fake-url.com/'
    });
    mockSessionsClient = new MockSessionsClient();
    middlemanApp.sessionsClient = mockSessionsClient;
    middlemanApp.start(assert.end);
});

test('everything ok - 200', testOpts, function t(assert) {
    const resp = {
        statusCode: 200,
        numActiveSessions: 5
    };
    mockSessionsClient.setResp(resp);
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
    const resp = {
        statusCode: 500
    };
    mockSessionsClient.setResp(resp);
    request(APP_URL, function onResp(err, resp, body) {
        assert.notOk(err);
        assert.equal(500, resp && resp.statusCode);
        assert.end();
    });
});

test('teardown', testOpts, function t(assert) {
    middlemanApp.shutdown(assert.end);
});
