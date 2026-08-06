/**
 * Shared helpers for live demo API flakiness, UI country labels, and invoice detail checks.
 */

/**
 * Retries an API action on transient 5xx without masking 4xx contract failures.
 * @param {() => Promise<import('@playwright/test').APIResponse>} action
 */
async function retryOnServerError(action, attempts = 3) {
  let response;
  for (let i = 0; i < attempts; i += 1) {
    response = await action();
    if (response.status() < 500) return response;
    await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
  }
  return response;
}

/** Maps short country names to the exact option label in Toolshop dropdowns. */
function countryOptionLabel(country) {
  if (!country) return 'Netherlands (the)';
  if (/netherlands/i.test(country)) return 'Netherlands (the)';
  return country;
}

/** Live SUT format: INV-<year><seq> e.g. INV-2026000028 */
const INV_NUMBER_PATTERN = /^INV-\d{4}\d+$/;

/**
 * Asserts GET /invoices/{id} content against the POST billing fixture.
 * Field names validated against live Toolshop response (invoicelines, not line_items).
 */
function expectInvoiceDetail(expect, detail, billing) {
  expect(detail.invoice_number, 'invoice_number should match INV-<year><seq>').toMatch(INV_NUMBER_PATTERN);
  expect(detail.billing_street).toBe(billing.billing_street);
  expect(detail.billing_city).toBe(billing.billing_city);
  expect(detail.billing_state).toBe(billing.billing_state);
  expect(detail.billing_country).toBe(billing.billing_country);
  expect(detail.billing_postal_code).toBe(billing.billing_postal_code);
  expect(detail.invoicelines, 'invoicelines should be present').toBeTruthy();
  expect(detail.invoicelines.length, 'invoice should have at least one line item').toBeGreaterThan(0);
  const line = detail.invoicelines[0];
  expect(line.product_id || line.product?.id, 'line item should reference a product').toBeTruthy();
  expect(Number(line.quantity), 'line item quantity should be > 0').toBeGreaterThan(0);
  expect(Number(detail.subtotal), 'subtotal should be > 0').toBeGreaterThan(0);
  expect(Number(detail.total), 'total should be > 0').toBeGreaterThan(0);
}

/** Contract negatives must be 4xx — 5xx is infra failure, not a passing rejection. */
function expectClientError(expect, status, message) {
  expect(status, message).toBeGreaterThanOrEqual(400);
  expect(status, `${message} (must not pass on 5xx)`).toBeLessThan(500);
}

module.exports = {
  retryOnServerError,
  countryOptionLabel,
  expectInvoiceDetail,
  expectClientError,
};
