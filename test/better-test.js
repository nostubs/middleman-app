const nock = require('nock');
const request = require('request');
const test = require('tape');
const App = require('../index.js');

const testOpts = {
    timeout: 500
};
const APP_URL = 'http://localhost:3000';
const SESSIONS_URL = 'http://localhost:4000';

let middlemanApp;

class MockSessionsClient {
    setResp(resp) {
        this.resp = resp;
    }

    getNumActiveSessions(cb) {
        cb(null, this.resp);
    }
}

test('start service', testOpts, function t(assert) {
    middlemanApp = new App({
        sessionsClientUrl: SESSIONS_URL
    });
    middlemanApp.start(assert.end);
});

test('everything ok - 200', testOpts, function t(assert) {
    nock(SESSIONS_URL).get('/').reply(200, {
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
    nock(SESSIONS_URL).get('/').reply(500);
    request(APP_URL, function onResp(err, resp, body) {
        assert.notOk(err);
        assert.equal(500, resp && resp.statusCode);
        assert.end();
    });
});

test('teardown', testOpts, function t(assert) {
    nock.cleanAll();
    middlemanApp.shutdown(assert.end);
});
