class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productCard = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    this.toast = page.locator('.toast-body');
  }

  async goto() {
    await this.page.goto('/');
    await this.productCard.first().waitFor({ state: 'visible' });
  }

  async openProductByIndex(index) {
    await this.productCard.nth(index).click();
    await this.addToCartButton.waitFor({ state: 'visible' });
  }

  async addCurrentProductToCart() {
    await this.addToCartButton.waitFor({ state: 'visible' });
    if (!(await this.addToCartButton.isEnabled())) {
      throw new Error('Add to cart is disabled (product likely out of stock)');
    }
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await this.addToCartButton.click();
    await this.toast.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    await this.page.waitForTimeout(400);
  }

  /** Adds two different in-stock products (skips disabled Add to cart). */
  async addTwoInStockProducts() {
    await this.goto();
    const total = Math.min(await this.productCard.count(), 12);
    let added = 0;

    for (let i = 0; i < total && added < 2; i += 1) {
      await this.goto();
      await this.productCard.nth(i).click();
      await this.addToCartButton.waitFor({ state: 'visible', timeout: 8000 });
      if (!(await this.addToCartButton.isEnabled())) continue;
      await this.addCurrentProductToCart();
      added += 1;
    }

    if (added < 2) {
      throw new Error(`Expected 2 in-stock products to add, only added ${added}`);
    }
  }
}

module.exports = { ProductsPage };
