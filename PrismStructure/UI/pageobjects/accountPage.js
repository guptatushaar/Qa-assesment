/** Account profile, My Invoices list, and nav sign-out. */
class AccountPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="first-name"]');
    this.lastName = page.locator('[data-test="last-name"]');
    this.email = page.locator('[data-test="email"]');
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.signOut = page.locator('[data-test="nav-sign-out"]');
    // Real invoice rows only — avoid empty-state / layout table rows.
    this.invoiceRows = page.locator('table tbody tr').filter({
      has: page.locator('a[href*="invoice"], [data-test="invoice-number"]'),
    });
  }

  async goto() {
    await this.page.goto('/account/profile');
    await this.firstName.waitFor({ state: 'visible', timeout: 15000 });
  }

  async gotoMyInvoices() {
    await this.page.goto('/account/invoices');
    await this.page.waitForURL(/invoice/i, { timeout: 15000 });
    await this.page.getByRole('heading', { name: /invoices/i }).waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Opens account menu and signs out — session should end on /auth/login. */
  async logout() {
    await this.navMenu.click();
    await this.signOut.click();
    await this.page.waitForURL(/auth\/login/i, { timeout: 15000 });
  }
}

module.exports = { AccountPage };
