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

            const parsedBody = body && JSON.parse(body);
            const numActiveSessions = parsedBody && parsedBody.numActiveSessions;
            return cb(null, {
                statusCode: resp.statusCode,
                numActiveSessions: numActiveSessions
            });
        });
    }
}

module.exports = SessionsClient;
