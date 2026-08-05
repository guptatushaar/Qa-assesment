class CartPage {
  constructor(page) {
    this.page = page;
    this.lineItem = page.locator('[data-test="product-quantity"]');
    this.quantityInput = page.locator('[data-test="product-quantity"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.proceedToCheckout = page.locator('[data-test="proceed-1"]');
    this.proceedToAddress = page.locator('[data-test="proceed-2"]');
    this.navCart = page.locator('[data-test="nav-cart"]');
  }

  async goto() {
    // Prefer nav cart; fall back to direct URL if badge/nav is slow after product adds.
    if (await this.navCart.isVisible().catch(() => false)) {
      await this.navCart.click({ timeout: 10000 }).catch(async () => {
        await this.page.goto('/checkout');
      });
    } else {
      await this.page.goto('/checkout');
    }
    await this.page.waitForURL(/checkout/, { timeout: 15000 });
    await this.proceedToCheckout.waitFor({ state: 'visible' });
  }

  async setQuantityForLine(index, qty) {
    const input = this.quantityInput.nth(index);
    await input.fill('');
    await input.fill(String(qty));
    await input.blur();
    await this.page.waitForTimeout(800);
  }

  async setQuantityForProduct(productName, qty) {
    const input = this.page.getByRole('spinbutton', { name: new RegExp(`Quantity for ${productName}`, 'i') });
    if (await input.count()) {
      await input.fill(String(qty));
      await input.press('Tab');
      return;
    }
    await this.setQuantityForLine(0, qty);
  }
}

module.exports = { CartPage };
