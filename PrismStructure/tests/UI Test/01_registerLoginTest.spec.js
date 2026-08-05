const { test, expect } = require('@playwright/test');
const { POManager } = require('../../UI/pageobjects/POManager');
const { generateUniqueUser, INVALID_PASSWORD, EMAIL_LOCAL } = require('../../commonUtils/utils');

/**
 * UI-AC1: registration, login, and auth negatives.
 * Happy path proves profile persistence; regressions cover duplicate email / bad password / empty password.
 */
test.describe('UI-AC1 User Registration & Login', () => {
  test('TC-UI-01/02: register, log in, verify saved profile info @smoke', async ({ page }) => {
    const po = new POManager(page);
    const user = generateUniqueUser();

    const registerPage = po.getRegisterPage();
    await registerPage.goto();
    await registerPage.registerWith(user);
    await expect(page).toHaveURL(/login/);

    const loginPage = po.getLoginPage();
    await loginPage.goto();
    await loginPage.loginAs(user.email, user.password);

    const accountPage = po.getAccountPage();
    await accountPage.goto();
    await expect(accountPage.firstName).toHaveValue(user.first_name);
    await expect(accountPage.lastName).toHaveValue(user.last_name);
    await expect(accountPage.email).toHaveValue(user.email);
  });

  test('TC-UI-03: registering with an already-used email is rejected @regression', async ({ page }) => {
    const po = new POManager(page);
    const user = generateUniqueUser();

    const registerPage = po.getRegisterPage();
    await registerPage.goto();
    await registerPage.registerWith(user);
    await expect(page).toHaveURL(/login/);

    await registerPage.goto();
    await registerPage.registerWith(user, { expectSuccess: false });
    await expect(registerPage.registerError).toBeVisible();
    await expect(registerPage.duplicateEmailMessage).toBeVisible();
  });

  test('TC-UI-04: login with incorrect password is rejected @regression', async ({ page }) => {
    const po = new POManager(page);
    const user = generateUniqueUser();

    const registerPage = po.getRegisterPage();
    await registerPage.goto();
    await registerPage.registerWith(user);

    const loginPage = po.getLoginPage();
    await loginPage.goto();
    await loginPage.loginAs(user.email, INVALID_PASSWORD, { expectSuccess: false });
    await expect(loginPage.error).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('TC-UI-09: login with empty password is blocked by validation @regression', async ({ page }) => {
    const po = new POManager(page);
    const loginPage = po.getLoginPage();
    await loginPage.goto();
    // Any well-formed email is enough; password empty triggers client-side required validation.
    await loginPage.email.fill(`${EMAIL_LOCAL}@gmail.com`);
    await loginPage.password.fill('');
    await loginPage.submit.click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/Password is required/i)).toBeVisible();
  });
});
