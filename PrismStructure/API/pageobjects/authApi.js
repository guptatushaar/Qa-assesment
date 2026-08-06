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

  /** Current user profile — used to prove token is still valid. */
  me(token) {
    return this.api.get('/users/me', this.api.authHeader(token));
  }

  /**
   * OpenAPI: logout is GET /users/logout (POST returns 405).
   * Invalidates the bearer token for subsequent protected calls.
   */
  logout(token) {
    return this.api.get('/users/logout', this.api.authHeader(token));
  }
}

module.exports = { AuthApi };
