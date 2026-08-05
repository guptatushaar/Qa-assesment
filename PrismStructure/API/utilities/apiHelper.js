const logger = require('../../commonUtils/loggerUtil');

class ApiHelper {
  constructor(request) {
    this.request = request;
  }

  async post(endpoint, data, headers = {}) {
    logger.step(`POST ${endpoint}`);
    const res = await this.request.post(endpoint, { data, headers });
    return res;
  }

  async get(endpoint, headers = {}) {
    logger.step(`GET ${endpoint}`);
    return this.request.get(endpoint, { headers });
  }

  authHeader(token) {
    return { Authorization: `Bearer ${token}` };
  }
}

module.exports = { ApiHelper };
