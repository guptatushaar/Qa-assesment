const { test, expect } = require('@playwright/test');
const { POManager } = require('../../UI/pageobjects/POManager');
const { generateUniqueUser, uiBillingAddress } = require('../../commonUtils/utils');
const { captureStep } = require('../../commonUtils/evidenceCapture');

/**
 * UI-AC2: cart → checkout → Cash on Delivery.
 * Known SUT quirk: Confirm must be pressed twice before an invoice appears.
 */

/** Shared setup: register, login, add two in-stock products to cart. */
async function registerLoginAndAddToCart(page, po) {
  const user = generateUniqueUser();
  const registerPage = po.getRegisterPage();
  await registerPage.goto();
  await registerPage.registerWith(user);

  const loginPage = po.getLoginPage();
  await loginPage.goto();
  await loginPage.loginAs(user.email, user.password);

  const productsPage = po.getProductsPage();
  await productsPage.addTwoInStockProducts();
  return user;
}

test.describe('UI-AC2 End-to-End Purchase Flow', () => {
  test('TC-UI-05: add multiple items and update quantity recalculates totals @smoke', async ({ page }, testInfo) => {
    const po = new POManager(page);
    await registerLoginAndAddToCart(page, po);

    const cartPage = po.getCartPage();
    await cartPage.goto();
    await expect(cartPage.lineItem).toHaveCount(2);

    const totalBefore = (await cartPage.cartTotal.textContent())?.trim() ?? '';
    await cartPage.setQuantityForLine(0, 2);
    // Quantity increase should change the cart total (handles $ / € prefixed amounts).
    await expect(cartPage.cartTotal).not.toHaveText(totalBefore);
    const totalAfter = (await cartPage.cartTotal.textContent())?.trim() ?? '';
    expect(totalAfter.length).toBeGreaterThan(0);
    expect(totalAfter).not.toMatch(/^[$€]?\s*0([.,]0+)?$/);
    await captureStep(page, testInfo, '05-cart-after-quantity-update');
  });

  test('TC-UI-06: Cash on Delivery checkout with double confirm generates an invoice @smoke', async ({ page }, testInfo) => {
    const po = new POManager(page);
    const user = await registerLoginAndAddToCart(page, po);

    const cartPage = po.getCartPage();
    await cartPage.goto();
    await cartPage.proceedToBillingAddress();

    const checkoutPage = po.getCheckoutPage();
    // Profile address usually enables Proceed; helper no-ops when already valid.
    await checkoutPage.fillBillingAddress(uiBillingAddress(user));
    await checkoutPage.proceedToPaymentStep();
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmTwice();
    await captureStep(page, testInfo, '06-after-confirm-twice');

    // AC2 evidence: invoice listed under My Invoices; number matches INV-<year><seq>.
    // (Payment-page invoice-number is flaky — Confirm×2 may complete via POST /invoices alone.)
    const accountPage = po.getAccountPage();
    await accountPage.gotoMyInvoices();
    await expect(accountPage.invoiceRows.first()).toBeVisible({ timeout: 20000 });
    const rowText = (await accountPage.invoiceRows.first().textContent())?.trim() ?? '';
    expect(rowText, 'My Invoices row should contain INV-<year><seq>').toMatch(/INV-\d{4}\d+/);
    await captureStep(page, testInfo, '06-my-invoices-with-invoice');
  });

  test('TC-UI-07: a single Confirm click does not yet generate an invoice @regression', async ({ page }, testInfo) => {
    const po = new POManager(page);
    const user = await registerLoginAndAddToCart(page, po);

    const cartPage = po.getCartPage();
    await cartPage.goto();
    await cartPage.proceedToBillingAddress();

    const checkoutPage = po.getCheckoutPage();
    await checkoutPage.fillBillingAddress(uiBillingAddress(user));
    await checkoutPage.proceedToPaymentStep();
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmOnce();

    // Documents known app behavior: one Confirm is not enough for an invoice.
    await expect(checkoutPage.successMessage).toBeVisible();
    await expect(checkoutPage.invoiceNumber).not.toBeVisible();
    await captureStep(page, testInfo, '07-after-confirm-once');

    // Stronger proof: My Invoices stays empty after Confirm×1 (new user has no prior invoices).
    const accountPage = po.getAccountPage();
    await accountPage.gotoMyInvoices();
    await expect(accountPage.invoiceRows).toHaveCount(0);
    await captureStep(page, testInfo, '07-my-invoices-empty');
  });

  test('TC-UI-08: checkout is blocked with an incomplete billing address @regression', async ({ page }, testInfo) => {
    const po = new POManager(page);
    const user = await registerLoginAndAddToCart(page, po);

    const cartPage = po.getCartPage();
    await cartPage.goto();
    await cartPage.proceedToBillingAddress();

    const checkoutPage = po.getCheckoutPage();
    await checkoutPage.fillBillingAddress(
      { ...uiBillingAddress(user), city: '', street: '', postal_code: '', house_number: '' },
      { forceEdit: true },
    );

    // Incomplete address should keep Proceed disabled / payment step unreachable.
    await expect
      .poll(async () => checkoutPage.isProceedEnabled(), { timeout: 10000 })
      .toBeFalsy();
    await expect(checkoutPage.paymentMethodSelect).not.toBeVisible();
    await captureStep(page, testInfo, '08-incomplete-billing-proceed-disabled');
  });
});
