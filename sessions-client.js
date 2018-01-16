const request = require('request');

class SessionsClient {
    constructor(url) {
        this.url = url;
    }

    getNumActiveSessions(cb) {
        request(this.url, function onResp(err, resp, body) {
            if (err) {
                return cb(err);
            }

            return cb({
                statusCode: resp.statusCode,
                numActiveSessions: body && body.numActiveSessions
            });
        });
    }
}

module.exports = SessionsClient;
