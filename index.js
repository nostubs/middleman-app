const SessionsClient = require('./sessions-client');
const PORT = 3000;

class MiddlemanApp {
    constructor(opts) {
        this.sessionsClient = new SessionsClient(opts.sessionsClientUrl);
    }

    start(cb) {
        cb();
    }

    shutdown(cb) {
        cb();
    }
}

module.exports = MiddlemanApp;
