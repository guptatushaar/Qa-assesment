const { RegisterPage } = require('./registerPage');
const { LoginPage } = require('./loginPage');
const { AccountPage } = require('./accountPage');
const { ProductsPage } = require('./productsPage');
const { CartPage } = require('./cartPage');
const { CheckoutPage } = require('./checkoutPage');

class POManager {
  constructor(page) {
    this.page = page;
  }

  getRegisterPage() {
    return new RegisterPage(this.page);
  }

  getLoginPage() {
    return new LoginPage(this.page);
  }

  getAccountPage() {
    return new AccountPage(this.page);
  }

  getProductsPage() {
    return new ProductsPage(this.page);
  }

  getCartPage() {
    return new CartPage(this.page);
  }

  getCheckoutPage() {
    return new CheckoutPage(this.page);
  }
}

module.exports = { POManager };
