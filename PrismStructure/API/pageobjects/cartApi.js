const { ApiHelper } = require('../utilities/apiHelper');

class CartApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  createCart(token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.post('/carts', {}, headers);
  }

  addProduct(cartId, productId, quantity, token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.post(`/carts/${cartId}`, { product_id: productId, quantity }, headers);
  }

  getCart(cartId, token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.get(`/carts/${cartId}`, headers);
  }

  getProducts() {
    return this.api.get('/products');
  }
}

module.exports = { CartApi };
