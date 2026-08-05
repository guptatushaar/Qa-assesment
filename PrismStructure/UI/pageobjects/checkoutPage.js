/**
 * Checkout billing + payment page object.
 * Purpose: address step (proceed-3), Cash on Delivery, and Confirm×1 / Confirm×2 flows.
 */
const { countryOptionLabel } = require('../../commonUtils/testHelpers');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.houseNumber = page.locator('[data-test="house_number"], [data-test="house-number"]');
    this.street = page.locator('[data-test="street"]');
    this.city = page.locator('[data-test="city"]');
    this.state = page.locator('[data-test="state"]');
    this.country = page.locator('[data-test="country"]');
    this.postalCode = page.locator('[data-test="postal_code"]');
    // Edit control only — never match proceed-3 (also a button inside app-address).
    this.editAddressButton = page.locator('[data-test="edit-address"], app-address .float-end').first();
    this.proceedToPayment = page.locator('[data-test="proceed-3"]');
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.confirmButton = page.locator('[data-test="finish"]');
    this.invoiceNumber = page.locator('[data-test="invoice-number"]');
    // Exact text — do NOT use /Invoice/i (matches hidden "My invoices" nav).
    this.successMessage = page.getByText('Payment was successful', { exact: true });
  }

  async isProceedEnabled() {
    if (!(await this.proceedToPayment.isVisible().catch(() => false))) return false;
    return this.proceedToPayment.isEnabled().catch(() => false);
  }

  async fillBillingAddress(address, { forceEdit = false } = {}) {
    // Registered profile usually pre-fills address — wait until Proceed is usable.
    if (!forceEdit) {
      try {
        await this.page.waitForFunction(
          () => {
            const btn = document.querySelector('[data-test="proceed-3"]');
            return Boolean(btn && !btn.disabled);
          },
          null,
          { timeout: 12000 },
        );
      } catch {
        // Profile may still need manual edit — continue below.
      }
      if (await this.isProceedEnabled()) return;
    }

    if (await this.editAddressButton.isVisible().catch(() => false)) {
      await this.editAddressButton.click();
    }

    await this.postalCode.waitFor({ state: 'visible' });
    await this.postalCode.fill(address.postal_code ?? '');

    if (await this.houseNumber.count()) {
      await this.houseNumber.first().fill(address.house_number ?? '');
      await this.houseNumber.first().press('Tab');
      // Wait for autofill (street/city) or Proceed enabling — not a fixed sleep.
      try {
        await this.page.waitForFunction(
          () => {
            const street = document.querySelector('[data-test="street"]');
            const btn = document.querySelector('[data-test="proceed-3"]');
            return Boolean(street?.value) || Boolean(btn && !btn.disabled);
          },
          null,
          { timeout: 8000 },
        );
      } catch {
        // Autofill may be unavailable — fill remaining fields below.
      }
    }

    if (forceEdit || !(await this.isProceedEnabled())) {
      await this.street.fill(address.street ?? '');
      await this.city.fill(address.city ?? '');
      await this.state.fill(address.state ?? '');
      if (address.country && (await this.country.isVisible().catch(() => false))) {
        const tag = await this.country.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
        if (tag === 'select') {
          await this.country.selectOption({ label: countryOptionLabel(address.country) });
        } else {
          await this.country.fill(address.country);
        }
      }
    }
  }

  async proceedToPaymentStep() {
    await this.proceedToPayment.waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      () => !document.querySelector('[data-test="proceed-3"]')?.disabled,
      null,
      { timeout: 30000 },
    );
    await this.proceedToPayment.click();
  }

  async selectCashOnDelivery() {
    await this.paymentMethodSelect.waitFor({ state: 'visible' });
    await this.paymentMethodSelect.selectOption({ label: 'Cash on Delivery' });
  }

  async confirmOnce() {
    await this.confirmButton.click();
    await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Known SUT behavior: first Confirm → "Payment was successful";
   * second Confirm → invoice is created.
   * Fails closed unless invoice-number appears or POST /invoices succeeds.
   */
  async confirmTwice() {
    await this.confirmButton.click();
    await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });

    // Listen before the second click — do not race against successMessage from Confirm #1.
    const invoiceCreated = Promise.race([
      this.invoiceNumber.waitFor({ state: 'visible', timeout: 20000 }),
      this.page.waitForResponse(
        (res) =>
          /\/invoices\b/i.test(res.url()) &&
          res.request().method() === 'POST' &&
          res.status() < 400,
        { timeout: 20000 },
      ),
    ]);

    await this.confirmButton.click();
    try {
      await invoiceCreated;
    } catch {
      throw new Error(
        'Confirm×2 did not create an invoice (invoice-number still hidden and no successful POST /invoices)',
      );
    }
  }
}

module.exports = { CheckoutPage };
