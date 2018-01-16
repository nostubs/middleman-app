const http = require('http');

class MockSessionsService {
    constructor(port) {
        this.port = port;
        this.server = http.createServer(this.handler.bind(this));
        this.responses = [];
    }

    start(cb) {
        this.server.listen(this.port, cb);
    }

    registerResp(resp) {
        this.responses.push(resp);
    }

    handler(req, resp) {
        req.on('data', (chunk) => {
            // no-op
        }).on('end', () => {
            const currentResp = this.responses.pop();
            resp.statusCode = currentResp.statusCode;
            if (currentResp.numActiveSessions !== undefined) {
                resp.setHeader('Content-Type', 'application/json');
                resp.write(JSON.stringify({
                    numActiveSessions: currentResp.numActiveSessions
                }));
            }
            resp.end();
        });
   }

    shutdown(cb) {
        this.server.close(cb);
    }
}

module.exports = MockSessionsService;
