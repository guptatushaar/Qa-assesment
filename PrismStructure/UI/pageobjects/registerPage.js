const { WebUtils } = require('../utilities/webUtils');

/**
 * Registration form page object.
 * Purpose: fill identity + address using SUT autofill (country/postal/house → street/city/state).
 */
class RegisterPage {
  constructor(page) {
    this.page = page;
    this.web = new WebUtils(page);
    this.firstName = page.locator('[data-test="first-name"]');
    this.lastName = page.locator('[data-test="last-name"]');
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.dob = page.locator('[data-test="dob"]');
    this.country = page.locator('[data-test="country"]');
    this.postalCode = page.locator('[data-test="postal_code"]');
    this.houseNumber = page.locator('[data-test="house_number"], [data-test="house-number"]');
    this.street = page.locator('[data-test="street"]');
    this.city = page.locator('[data-test="city"]');
    this.state = page.locator('[data-test="state"]');
    this.phone = page.locator('[data-test="phone"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
    this.registerError = page.locator('[data-test="register-error"]');
    this.duplicateEmailMessage = page.getByText(/already exists/i);
  }

  async goto() {
    await this.web.goto('/auth/register');
    await this.firstName.waitFor({ state: 'visible' });
  }

  /**
   * UI country dropdown uses ISO labels like "Netherlands (the)".
   * API payloads can keep a short country string.
   */
  countryLabel(country) {
    if (!country) return 'Netherlands (the)';
    if (/netherlands/i.test(country)) return 'Netherlands (the)';
    return country;
  }

  async registerWith(user, { expectSuccess = true } = {}) {
    await this.firstName.fill(user.first_name);
    await this.lastName.fill(user.last_name);
    await this.dob.fill(user.dob);

    // App: choose country + postal + house number → street/city/state auto-fill.
    await this.country.selectOption({ label: this.countryLabel(user.address.country) });
    await this.postalCode.fill(user.address.postal_code);
    if (await this.houseNumber.count()) {
      await this.houseNumber.first().fill(user.address.house_number);
      await this.houseNumber.first().press('Tab');
    }

    await this.page
      .waitForFunction(
        () => {
          const street = document.querySelector('[data-test="street"]');
          const city = document.querySelector('[data-test="city"]');
          return Boolean(street?.value && city?.value);
        },
        null,
        { timeout: 10000 },
      )
      .catch(async () => {
        if (user.address.street) await this.street.fill(user.address.street);
        if (user.address.city) await this.city.fill(user.address.city);
        if (user.address.state) await this.state.fill(user.address.state);
      });

    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.registerButton.click();
    if (expectSuccess) {
      await this.page.waitForURL(/login/, { timeout: 15000 });
    }
  }
}

module.exports = { RegisterPage };
