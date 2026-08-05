const { WebUtils } = require('../utilities/webUtils');

/**
 * Login page object.
 * Purpose: credentials submit; expectSuccess=false for negative paths that must stay on /login.
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    this.web = new WebUtils(page);
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.submit = page.locator('[data-test="login-submit"]');
    this.error = page.locator('[data-test="login-error"], .alert-danger');
  }

  async goto() {
    await this.web.goto('/auth/login');
  }

  async loginAs(email, password, { expectSuccess = true } = {}) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
    if (expectSuccess) {
      await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15000 });
    }
  }
}

module.exports = { LoginPage };
