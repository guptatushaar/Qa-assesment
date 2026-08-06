const { ApiHelper } = require('../utilities/apiHelper');

class CartApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  createCart(token) {
    return this.api.post('/carts', {}, this.api.optionalAuth(token));
  }

  addProduct(cartId, productId, quantity, token) {
    return this.api.post(
      `/carts/${cartId}`,
      { product_id: productId, quantity },
      this.api.optionalAuth(token),
    );
  }

  getCart(cartId, token) {
    return this.api.get(`/carts/${cartId}`, this.api.optionalAuth(token));
  }

  getProducts() {
    return this.api.get('/products');
  }
}

module.exports = { CartApi };
