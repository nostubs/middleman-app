const http = require('http');
const SessionsClient = require('./sessions-client');
const PORT = 3000;

class MiddlemanApp {
    constructor(opts) {
        this.sessionsClient = new SessionsClient(opts.sessionsClientUrl);
        this.server = http.createServer(this.handler.bind(this));
    }

    start(cb) {
        this.server.listen(PORT, cb);
    }

    handler(req, resp) {
        req.on('data', (chunk) => {
            // no-op
        }).on('end', () => {
            this.sessionsClient.getNumActiveSessions((err, sessionsResp) => {
                resp.statusCode = sessionsResp.statusCode;
                if (sessionsResp.numActiveSessions !== undefined) {
                    resp.setHeader('Content-Type', 'application/json');
                    resp.write(JSON.stringify({
                        numActiveSessions: sessionsResp.numActiveSessions
                    }));
                }
                resp.end();
            });
        });
   }

    shutdown(cb) {
        this.server.close(cb);
    }
}

module.exports = MiddlemanApp;
