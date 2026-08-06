const { ApiHelper } = require('../utilities/apiHelper');

class InvoiceApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  generateInvoice(payload, token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.post('/invoices', payload, headers);
  }

  /** GET /invoices/{id} — detail for line items, totals, billing, INV- number. */
  getInvoice(invoiceId, token) {
    const headers = token ? this.api.authHeader(token) : {};
    return this.api.get(`/invoices/${invoiceId}`, headers);
  }
}

module.exports = { InvoiceApi };
