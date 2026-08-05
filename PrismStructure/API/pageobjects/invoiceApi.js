const { ApiHelper } = require('../utilities/apiHelper');

class InvoiceApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  generateInvoice(payload, token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.post('/invoices', payload, headers);
  }
}

module.exports = { InvoiceApi };
