const { ApiHelper } = require('../utilities/apiHelper');

class AuthApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  register(user) {
    return this.api.post('/users/register', user);
  }

  login(email, password) {
    return this.api.post('/users/login', { email, password });
  }
}

module.exports = { AuthApi };
