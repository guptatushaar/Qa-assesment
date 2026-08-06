const logger = require('../../commonUtils/loggerUtil');

class ApiHelper {
  constructor(request) {
    this.request = request;
  }

  async post(endpoint, data, headers = {}) {
    logger.step(`POST ${endpoint}`);
    return this.request.post(endpoint, { data, headers });
  }

  async get(endpoint, headers = {}) {
    logger.step(`GET ${endpoint}`);
    return this.request.get(endpoint, { headers });
  }

  authHeader(token) {
    return { Authorization: `Bearer ${token}` };
  }

  /** Bearer header when token is set; empty object for anonymous calls. */
  optionalAuth(token) {
    return token ? this.authHeader(token) : {};
  }
}

module.exports = { ApiHelper };
