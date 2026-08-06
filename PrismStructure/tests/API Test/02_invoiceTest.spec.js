const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../API/pageobjects/authApi');
const { CartApi } = require('../../API/pageobjects/cartApi');
const { InvoiceApi } = require('../../API/pageobjects/invoiceApi');
const { generateUniqueUser, validInvoicePayload } = require('../../commonUtils/utils');
const { retryOnServerError, expectInvoiceDetail, expectClientError } = require('../../commonUtils/testHelpers');

// API-AC2: products → cart_items → invoice (guide fixture) + GET detail + contract negatives.

/** Registers, logs in, creates a cart, and adds one product — shared AC2 precondition. */
async function setupAuthenticatedCartWithProduct(request) {
  const authApi = new AuthApi(request);
  const cartApi = new CartApi(request);
  const user = generateUniqueUser();

  const registerRes = await retryOnServerError(() => authApi.register(user));
  expect(registerRes.status(), 'registration should succeed during setup').toBeLessThan(300);

  const loginRes = await retryOnServerError(() => authApi.login(user.email, user.password));
  expect(loginRes.status(), 'login should succeed during setup').toBe(200);
  const { access_token: token } = await loginRes.json();

  const productsRes = await retryOnServerError(() => cartApi.getProducts());
  expect(productsRes.status(), 'products should load during setup').toBe(200);
  const products = await productsRes.json();
  const productList = products.data ?? products;
  const inStock =
    productList.find(
      (p) => p.in_stock !== false && (p.stock == null || Number(p.stock) > 0),
    ) ?? productList[0];
  expect(inStock?.id, 'setup needs at least one product id').toBeTruthy();

  const cartRes = await retryOnServerError(() => cartApi.createCart(token));
  expect(cartRes.status(), 'cart creation should succeed during setup').toBeLessThan(300);
  const cart = await cartRes.json();

  const addRes = await retryOnServerError(() => cartApi.addProduct(cart.id, inStock.id, 1, token));
  expect(addRes.status(), 'add product should succeed during setup').toBeLessThan(300);

  return { token, cartId: cart.id };
}

test.describe('API-AC2 Product Selection & Invoice Generation', () => {
  test('API-AC2-01/02/03: retrieve products, build cart, generate invoice, GET detail @smoke', async ({ request }) => {
    const cartApi = new CartApi(request);
    const invoiceApi = new InvoiceApi(request);

    const { token, cartId } = await setupAuthenticatedCartWithProduct(request);

    const cartCheck = await cartApi.getCart(cartId, token);
    expect(cartCheck.status()).toBe(200);
    const cartBody = await cartCheck.json();
    // Contract field is cart_items (not cart_products / items fallbacks).
    expect(cartBody).toHaveProperty('cart_items');
    expect(cartBody.cart_items.length).toBeGreaterThan(0);

    const payload = validInvoicePayload(cartId);
    const invoiceRes = await invoiceApi.generateInvoice(payload, token);
    expect(invoiceRes.status(), 'invoice generation should succeed with a valid payload').toBeLessThan(300);
    const invoiceBody = await invoiceRes.json();
    const invoiceId = invoiceBody.id ?? invoiceBody.invoice_id;
    expect(invoiceId).toBeTruthy();

    // Detail verification: line items, billing match, INV-<year><seq>, totals.
    const detailRes = await invoiceApi.getInvoice(invoiceId, token);
    expect(detailRes.status(), 'GET /invoices/{id} should succeed').toBe(200);
    const detail = await detailRes.json();
    expectInvoiceDetail(expect, detail, payload);
  });

  test('API-AC2-04: invoice generation rejects missing required billing field @regression', async ({ request }) => {
    const invoiceApi = new InvoiceApi(request);
    const { token, cartId } = await setupAuthenticatedCartWithProduct(request);

    const payload = validInvoicePayload(cartId);
    delete payload.billing_country;

    const res = await invoiceApi.generateInvoice(payload, token);
    expectClientError(expect, res.status(), 'missing required billing field must be rejected');
  });

  test('API-AC2-05: invoice generation rejects an invalid cart_id @regression', async ({ request }) => {
    const invoiceApi = new InvoiceApi(request);
    const { token } = await setupAuthenticatedCartWithProduct(request);

    const payload = validInvoicePayload('non-existent-cart-id');
    const res = await invoiceApi.generateInvoice(payload, token);
    expectClientError(expect, res.status(), 'invalid cart_id must be rejected');
  });

  test('API-AC2-06: invoice generation without bearer token is rejected @regression', async ({ request }) => {
    const invoiceApi = new InvoiceApi(request);
    const { cartId } = await setupAuthenticatedCartWithProduct(request);

    const res = await invoiceApi.generateInvoice(validInvoicePayload(cartId));
    const status = res.status();
    expect([401, 403], 'missing auth token must be unauthorized (not 5xx)').toContain(status);
  });
});
