class MockSessionsClient {
    setResp(resp) {
        this.resp = resp;
    }

    getNumActiveSessions(cb) {
        cb(null, this.resp);
    }
}

module.exports = MockSessionsClient;
