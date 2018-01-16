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
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            this.sessionsClient.getNumActiveSessions((err, sessionsResp) => {
                resp.statusCode = sessionsResp.statusCode;
                if (sessionsResp.numActiveSessions) {
                    resp.setHeader('Content-Type', 'application/json');
                    resp.end(JSON.stringify({
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
