/**
 * Checkout billing + payment page object.
 * Purpose: address step (proceed-3), Cash on Delivery, and Confirm×1 / Confirm×2 flows.
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.houseNumber = page.locator('[data-test="house_number"], [data-test="house-number"]');
    this.street = page.locator('[data-test="street"]');
    this.city = page.locator('[data-test="city"]');
    this.state = page.locator('[data-test="state"]');
    this.country = page.locator('[data-test="country"]');
    this.postalCode = page.locator('[data-test="postal_code"]');
    this.editAddressButton = page.locator('app-address .float-end, [data-test="edit-address"]');
    this.proceedToPayment = page.locator('[data-test="proceed-3"]');
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.confirmButton = page.locator('[data-test="finish"]');
    this.invoiceNumber = page.locator('[data-test="invoice-number"]');
    // Exact text — do NOT use /Invoice/i (matches hidden "My invoices" nav).
    this.successMessage = page.getByText('Payment was successful', { exact: true });
  }

  /** Maps short country names to the exact option label shown in the UI dropdown. */
  countryLabel(country) {
    if (!country) return 'Netherlands (the)';
    if (/netherlands/i.test(country)) return 'Netherlands (the)';
    return country;
  }

  async isProceedEnabled() {
    if (!(await this.proceedToPayment.isVisible().catch(() => false))) return false;
    return this.proceedToPayment.isEnabled().catch(() => false);
  }

  async fillBillingAddress(address, { forceEdit = false } = {}) {
    // Registered profile usually pre-fills address — wait for Proceed before editing.
    if (!forceEdit) {
      for (let i = 0; i < 12; i += 1) {
        if (await this.isProceedEnabled()) return;
        await this.page.waitForTimeout(400);
      }
    }

    if (await this.editAddressButton.isVisible().catch(() => false)) {
      await this.editAddressButton.click();
    }

    await this.postalCode.waitFor({ state: 'visible' });
    await this.postalCode.fill(address.postal_code ?? '');

    if (await this.houseNumber.count()) {
      await this.houseNumber.first().fill(address.house_number ?? '');
      await this.houseNumber.first().press('Tab');
      await this.page.waitForTimeout(1200);
    }

    if (forceEdit || !(await this.isProceedEnabled())) {
      await this.street.fill(address.street ?? '');
      await this.city.fill(address.city ?? '');
      await this.state.fill(address.state ?? '');
      if (address.country && (await this.country.isVisible().catch(() => false))) {
        const tag = await this.country.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
        if (tag === 'select') {
          await this.country.selectOption({ label: this.countryLabel(address.country) });
        } else {
          await this.country.fill(address.country);
        }
      }
      await this.page.waitForTimeout(500);
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
    await this.page.waitForTimeout(800);
  }

  /**
   * Known SUT behavior: first Confirm → "Payment was successful";
   * second Confirm → invoice is created.
   */
  async confirmTwice() {
    await this.confirmButton.click();
    await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
    await this.confirmButton.click();
    // Second confirm may swap the success banner for invoice details.
    await this.page.waitForTimeout(1500);
  }
}

module.exports = { CheckoutPage };
