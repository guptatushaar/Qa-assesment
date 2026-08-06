const { ApiHelper } = require('../utilities/apiHelper');

class InvoiceApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  generateInvoice(payload, token) {
    return this.api.post('/invoices', payload, this.api.optionalAuth(token));
  }

  /** GET /invoices/{id} — detail for line items, totals, billing, INV- number. */
  getInvoice(invoiceId, token) {
    return this.api.get(`/invoices/${invoiceId}`, this.api.optionalAuth(token));
  }
}

module.exports = { InvoiceApi };
