/**
 * Cart page object.
 * Purpose: line quantities, totals, and checkout step navigation (proceed-1 → proceed-2).
 */
class CartPage {
  constructor(page) {
    this.page = page;
    this.lineItem = page.locator('[data-test="product-quantity"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.proceedToCheckout = page.locator('[data-test="proceed-1"]');
    this.proceedToAddress = page.locator('[data-test="proceed-2"]');
    this.navCart = page.locator('[data-test="nav-cart"]');
  }

  async goto() {
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

  /** Cart → Sign in step → Billing Address step. */
  async proceedToBillingAddress() {
    await this.proceedToCheckout.click();
    await this.proceedToAddress.click();
  }

  async setQuantityForLine(index, qty) {
    const input = this.lineItem.nth(index);
    const previousTotal = (await this.cartTotal.textContent())?.trim() ?? '';
    await input.fill('');
    await input.fill(String(qty));
    await input.blur();
    // Fail if quantity change does not update the cart total.
    await this.page.waitForFunction(
      ({ prev }) => {
        const el = document.querySelector('[data-test="cart-total"]');
        const now = el?.textContent?.trim() ?? '';
        return now.length > 0 && now !== prev;
      },
      { prev: previousTotal },
      { timeout: 10000 },
    );
  }
}

module.exports = { CartPage };
