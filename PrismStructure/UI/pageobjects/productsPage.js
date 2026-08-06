/**
 * Product catalog page object.
 * Purpose: open products and add in-stock items to cart for checkout flows.
 */
class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productCard = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.toast = page.locator('.toast-body');
  }

  async goto() {
    await this.page.goto('/');
    await this.productCard.first().waitFor({ state: 'visible' });
  }

  async returnToCatalog() {
    await this.page.goBack().catch(() => this.goto());
    await this.productCard.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => this.goto());
  }

  async addCurrentProductToCart() {
    await this.addToCartButton.waitFor({ state: 'visible' });
    if (!(await this.addToCartButton.isEnabled())) {
      throw new Error('Add to cart is disabled (product likely out of stock)');
    }
    await this.addToCartButton.scrollIntoViewIfNeeded();
    // Prefer cart network confirmation — a leftover toast from a prior add must not short-circuit.
    const cartResponse = this.page.waitForResponse(
      (res) => /\/carts?\b/i.test(res.url()) && res.request().method() !== 'GET' && res.status() < 400,
      { timeout: 10000 },
    );
    await this.addToCartButton.click();
    await cartResponse;
  }

  /**
   * Adds two different in-stock products.
   * Uses goBack between picks instead of reloading home for every catalog index.
   */
  async addTwoInStockProducts() {
    await this.goto();
    const total = Math.min(await this.productCard.count(), 12);
    let added = 0;

    for (let i = 0; i < total && added < 2; i += 1) {
      await this.productCard.nth(i).click();
      try {
        await this.addToCartButton.waitFor({ state: 'visible', timeout: 8000 });
      } catch {
        await this.returnToCatalog();
        continue;
      }

      if (!(await this.addToCartButton.isEnabled())) {
        await this.returnToCatalog();
        continue;
      }

      await this.addCurrentProductToCart();
      added += 1;
      if (added < 2) await this.returnToCatalog();
    }

    if (added < 2) {
      throw new Error(`Expected 2 in-stock products to add, only added ${added}`);
    }
  }
}

module.exports = { ProductsPage };
