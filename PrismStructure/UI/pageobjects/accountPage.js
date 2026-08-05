class AccountPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="first-name"]');
    this.lastName = page.locator('[data-test="last-name"]');
    this.email = page.locator('[data-test="email"]');
    this.profileLink = page.locator('[data-test="nav-profile"]');
    this.invoicesLink = page.locator('[data-test="nav-my-invoices"]');
    this.invoiceRows = page.locator('table tbody tr, [data-test="invoice-number"]');
    this.navSignIn = page.locator('[data-test="nav-sign-in"]');
  }

  async goto() {
    await this.page.goto('/account/profile');
    await this.firstName.waitFor({ state: 'visible', timeout: 15000 });
  }

  async gotoMyInvoices() {
    await this.page.goto('/account/invoices');
    if (await this.invoicesLink.count()) {
      await this.invoicesLink.first().click().catch(() => {});
    }
    await this.page.waitForURL(/invoice/i, { timeout: 15000 }).catch(() => {});
  }

  async expectLoggedInAs(user) {
    const fullName = `${user.first_name} ${user.last_name}`;
    const userMenu = this.page.getByRole('button', { name: fullName });
    if (await userMenu.count()) {
      await userMenu.waitFor({ state: 'visible' });
      return;
    }
    await this.navSignIn.waitFor({ state: 'hidden', timeout: 15000 });
  }
}

module.exports = { AccountPage };
